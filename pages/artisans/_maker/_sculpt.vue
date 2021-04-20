<template>
  <div class="artisan-container">
    <div style="padding: 16px 0">
      <a-spin tip="Loading..." :spinning="loading">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col v-for="colorway in colorways" :key="colorway.id" :span="6">
            <a-card hoverable>
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <template slot="actions" class="ant-card-actions">
                <a-icon key="star" type="star" @click="addWishlist(colorway)" />
                <a-icon
                  key="retweet"
                  type="retweet"
                  @click="addTradeList(colorway)"
                />
              </template>
              <a-card-meta :title="colorway.name">
                <template v-if="colorway.releaseDate" slot="description">
                  {{ colorway.releaseDate }}
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      colorways: [],
      loading: true,
    }
  },
  async fetch() {
    this.colorways = await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/${this.sculpt}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false
        return res.result.pageContext.sculpt.colorways
      })
      .catch(() => {
        this.loading = false
      })
  },
  methods: {
    addWishlist(clw) {
      // console.log(clw)
    },
    addTradeList(clw) {
      // console.log(clw)
    },
  },
}
</script>

<style>
.artisan-container {
  text-align: center;
}

.artisan-container .ant-card-cover {
  height: 300px;
  overflow: hidden;
}

.artisan-container .ant-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
