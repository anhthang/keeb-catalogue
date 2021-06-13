<template>
  <a-card title="Preview" size="small">
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

    <div class="wishlist-preview">
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
import { COLLECTIONS } from '@/constants'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      loading: false,
      draggableTradeList: [],
      draggableWishList: [],
    }
  },
  computed: {
    ...mapState('artisans', ['wishlistSettings']),
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
          this.draggableWishList = this.getCollection(after.wish.collection)
        }
        if (after.trade.collection !== before.trade.collection) {
          this.draggableTradeList = this.getCollection(after.trade.collection)
        }
      },
      deep: true,
    },
    draggableWishList() {
      const wishList = this.draggableWishList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      const key = `${COLLECTIONS}_${this.wishlistSettings.wish.collection}`
      localStorage.setItem(key, JSON.stringify(wishList))
    },
    draggableTradeList() {
      const tradeList = this.draggableTradeList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      const key = `${COLLECTIONS}_${this.wishlistSettings.trade.collection}`
      localStorage.setItem(key, JSON.stringify(tradeList))
    },
  },
  beforeMount() {
    this.draggableWishList = this.getCollection(
      this.wishlistSettings.wish.collection
    )
    this.draggableTradeList = this.getCollection(
      this.wishlistSettings.trade.collection
    )
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    getCollection(name) {
      const collection =
        JSON.parse(localStorage.getItem(`${COLLECTIONS}_${name}`)) || {}

      return Object.values(collection)
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

      const wishList = JSON.parse(
        localStorage.getItem(
          `${COLLECTIONS}_${this.wishlistSettings.wish.collection}`
        )
      )
      const tradeList = JSON.parse(
        localStorage.getItem(
          `${COLLECTIONS}_${this.wishlistSettings.trade.collection}`
        )
      )

      const json = {
        settings: this.kaSettings,
        caps: Object.values(wishList).map((i) => ({
          id: i.id,
          isPriority: false,
          legendColor: 'Crimson',
        })),
        tradeCaps: this.wishlistSettings.want_to_trade
          ? Object.values(tradeList).map((i) => ({
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
  .ant-card-head-title {
    text-align: center;
  }
}
</style>
