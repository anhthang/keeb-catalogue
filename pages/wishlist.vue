<template>
  <div class="wishlist" style="padding: 16px 0">
    <a-row :gutter="16">
      <a-col :span="6">
        <wishlist-settings />
      </a-col>
      <a-col :span="18">
        <wishlist-preview />
      </a-col>
    </a-row>

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
      base64Img: undefined,
    }
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
}

.wishlist .ant-card-cover {
  height: 250px;
  overflow: hidden;
}

.wishlist .ant-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
