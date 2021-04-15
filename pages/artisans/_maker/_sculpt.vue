<template>
  <div class="container">
    <div style="padding: 16px 0">
      <a-spin tip="Loading..." :spinning="loading">
        <a-row :gutter="[16, 16]">
          <a-col v-for="colorway in colorways" :key="colorway.id" :span="6">
            <a-card hoverable>
              <img
                slot="cover"
                class="colorway-view"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <template slot="actions" class="ant-card-actions">
                <a-icon key="star" type="star" />
                <a-icon key="retweet" type="retweet" />
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
}
</script>

<style>
.colorway-view {
  width: 250px;
  height: 250px;
  object-fit: cover;
}
</style>
