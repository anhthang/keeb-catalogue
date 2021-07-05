<template>
  <a-card title="Preview" size="small" class="wishlist-preview">
    <template slot="extra">
      <a-button disabled type="primary" icon="copy"> Copy </a-button>
      <a-button
        :loading="loading"
        type="primary"
        icon="download"
        @click="generateImg"
      >
        Download
      </a-button>
    </template>

    <div class="artisan-container">
      <a-divider v-if="draggableWishList.length">
        {{ wishlistSettings.wish.title }}
      </a-divider>
      <a-row :gutter="[16, 16]">
        <draggable :list="draggableWishList" group="group">
          <a-col
            v-for="colorway in draggableWishList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="cardTitle(colorway)" size="small" :bordered="false">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <a-icon
                slot="extra"
                type="delete"
                @click="removeCap(colorway, 'wish')"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>

      <a-divider
        v-if="draggableTradeList.length && wishlistSettings.want_to_trade"
      >
        {{ wishlistSettings.trade.title }}
      </a-divider>
      <a-row v-if="wishlistSettings.want_to_trade" :gutter="[16, 16]">
        <draggable :list="draggableTradeList" group="group">
          <a-col
            v-for="colorway in draggableTradeList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="cardTitle(colorway)" size="small" :bordered="false">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <a-icon
                slot="extra"
                type="delete"
                @click="removeCap(colorway, 'trade')"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>
    </div>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      loading: false,
      collection: {},
      draggableTradeList: [],
      draggableWishList: [],
    }
  },
  computed: {
    ...mapState('artisans', ['wishlistSettings']),
    ...mapState(['user', 'authenticated']),
    kaSettings() {
      return {
        capsPerLine: this.wishlistSettings.caps_per_line,
        priority: {
          color: 'DarkGoldenRod',
          font: 'RedRock',
        },
        legends: {
          color: 'Orchid',
          font: 'Roboto',
        },
        title: {
          color: 'Crimson',
          font: 'RedRock',
          text: this.wishlistSettings.wish.title,
        },
        tradeTitle: {
          color: 'Orchid',
          font: 'RedRock',
          text: this.wishlistSettings.trade.title,
        },
        extraText: {
          color: 'Turquoise',
          font: 'Roboto',
          text: 'Willing to topup if needed',
        },
        background: {
          color: 'Black',
        },
        social: {
          reddit: this.wishlistSettings.social.reddit,
          discord: this.wishlistSettings.social.discord,
        },
      }
    },
  },
  watch: {
    wishlistSettings: {
      handler(after, before) {
        if (after.wish.collection !== before.wish.collection) {
          this.draggableWishList = this.collection[after.wish.collection]
        }
        if (after.trade.collection !== before.trade.collection) {
          this.draggableTradeList = this.collection[after.trade.collection]
        }
      },
      deep: true,
    },
  },
  beforeMount() {
    this.getUserCollections()
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    getUserCollections() {
      if (this.authenticated) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .get()
          .then((doc) => {
            doc.docs.forEach((d) => {
              this.collection[d.id] = Object.values(d.data())
            })
          })
      } else {
        const wish = JSON.parse(localStorage.getItem(`KeebCatalogue_wish`))
        const trade = JSON.parse(localStorage.getItem(`KeebCatalogue_trade`))
        this.collection = {
          wish: Object.values(wish || {}),
          trade: Object.values(trade || {}),
        }
      }
    },
    removeCap(colorway, type) {
      const vm = this
      this.$confirm({
        title: 'Do you want to remove this keycap?',
        content: 'Once confirmed, this action cannot be undone.',
        onOk() {
          if (type === 'wish') {
            vm.draggableWishList = vm.draggableWishList.filter(
              (i) => i.id !== colorway.id
            )
          } else {
            vm.draggableTradeList = vm.draggableTradeList.filter(
              (i) => i.id !== colorway.id
            )
          }
        },
      })
    },
    async generateImg() {
      this.loading = true

      // this.saveSettings()

      const json = {
        settings: this.kaSettings,
        caps: this.draggableWishList.map((i) => ({
          id: i.id,
          isPriority: false,
          legendColor: 'Crimson',
        })),
        tradeCaps: this.wishlistSettings.want_to_trade
          ? this.draggableTradeList.map((i) => ({
              id: i.id,
              isPriority: false,
              legendColor: 'Orchid',
            }))
          : [],
      }

      const base64Img = await this.$axios
        .post('https://app.keycap-archivist.com/api/v2/wishlist', json, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.loading = false
          return Buffer.from(response.data, 'binary').toString('base64')
        })
        .catch((e) => {
          this.loading = false
        })

      const link = document.createElement('a')
      link.setAttribute('download', 'wishlist.png')
      link.setAttribute('href', `data:image/png;base64,${base64Img}`)
      link.click()

      this.loading = false
    },
  },
}
</script>

<style lang="less">
.wishlist-preview {
  height: 100%;
}
</style>
