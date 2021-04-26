<template>
  <div class="wishlist" style="padding: 16px 0">
    <div>
      <h3>Want</h3>
      <a-row :gutter="[16, 16]">
        <draggable :list="draggableWishList">
          <a-col
            v-for="colorway in draggableWishList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="colorway.name" size="small">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>
    </div>
    <div v-if="draggableTradeList.length">
      <h3>Have</h3>
      <a-row :gutter="[16, 16]">
        <draggable :list="draggableTradeList">
          <a-col
            v-for="colorway in draggableTradeList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="colorway.name" size="small">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>
    </div>
    <span>
      <a-button
        type="primary"
        icon="file-image"
        :loading="loading"
        @click="generateWishlist"
      >
        Generate
      </a-button>
      <a
        v-if="base64Img"
        :href="`data:image/png;base64,${base64Img}`"
        download="wishlist.png"
      >
        <a-button icon="download" type="primary"> Download </a-button>
      </a>
    </span>
    <div style="padding: 16px 0">
      <img v-if="base64Img" :src="`data:image/png;base64,${base64Img}`" />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      loading: false,
      json: {
        settings: {
          capsPerLine: '3',
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
            text: '',
          },
          tradeTitle: {
            color: 'Orchid',
            font: 'RedRock',
            text: 'Collected',
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
            reddit: '',
            discord: '',
          },
        },
        tradeCaps: [],
        caps: [],
      },
      base64Img: undefined,
      draggableWishList: [],
      draggableTradeList: [],
    }
  },
  watch: {
    draggableWishList() {
      this.json.caps = this.draggableWishList.map((i) => ({
        id: i.id,
        isPriority: false,
        legendColor: 'Crimson',
      }))
    },
    draggableTradeList() {
      this.json.tradeCaps = this.draggableTradeList.map((i) => ({
        id: i.id,
        isPriority: false,
        legendColor: 'Crimson',
      }))
    },
  },
  beforeMount() {
    const wishList = JSON.parse(localStorage.getItem('KeebCal_wishList')) || {}
    const tradeList =
      JSON.parse(localStorage.getItem('KeebCal_tradeList')) || {}

    this.draggableWishList = Object.values(wishList)
    this.draggableTradeList = Object.values(tradeList)
  },
  methods: {
    async generateWishlist() {
      this.loading = true

      this.base64Img = await this.$axios
        .post('https://app.keycap-archivist.com/api/v2/wishlist', this.json, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.loading = false
          return Buffer.from(response.data, 'binary').toString('base64')
        })
        .catch((e) => {
          this.loading = false
        })
    },
  },
}
</script>

<style>
.wishlist {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
