<template>
  <div class="artisan-container">
    <div style="padding: 16px 0">
      <a-spin tip="Loading..." :spinning="loading">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col v-for="sculpt in sculpts" :key="sculpt.id" :span="6">
            <nuxt-link :to="`/artisans${sculpt.link.replace('/maker', '')}`">
              <a-card hoverable>
                <img slot="cover" :alt="sculpt.name" :src="sculpt.previewImg" />
                <a-card-meta :title="sculpt.name">
                  <!-- <template slot="description"> www.instagram.com </template> -->
                </a-card-meta>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      sculpts: [],
      loading: true,
    }
  },
  async fetch() {
    this.sculpts = await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false
        return res.result.pageContext.maker.sculpts
      })
      .catch(() => {
        this.loading = false
      })
  },
  // fetchOnServer: false,
  // computed: {
  //   ...mapState(['sculpts']),
  // },
  // beforeMount() {
  //   this.$store.dispatch('artisans/fetchScults')
  // },
}
</script>

<style>
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
