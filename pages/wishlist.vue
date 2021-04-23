<template>
  <div class="wishlist" style="padding: 16px 0">
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
export default {
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
    }
  },
  beforeMount() {
    this.wishList = JSON.parse(localStorage.getItem('KeebCal_wishList')) || {}
    this.tradeList = JSON.parse(localStorage.getItem('KeebCal_tradeList')) || {}
  },
  methods: {
    async generateWishlist() {
      this.loading = true
      this.json.caps = Object.values(this.wishList).map((i) => ({
        id: i.id,
        isPriority: false,
        legendColor: 'Crimson',
      }))
      this.json.tradeCaps = Object.values(this.tradeList).map((i) => ({
        id: i.id,
        isPriority: false,
        legendColor: 'Orchid',
      }))

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
          // console.log(e)
          // setErrorLoading(true)
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
