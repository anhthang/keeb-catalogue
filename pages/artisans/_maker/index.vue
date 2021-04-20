<template>
  <div class="artisan-container">
    <a-page-header :title="makerInfo.name">
      <template slot="extra">
        <a-button v-if="makerInfo.website" key="3" type="primary">
          <a :href="makerInfo.website" target="_blank">
            <a-icon type="global" /> Website
          </a>
        </a-button>
        <a-button v-if="makerInfo.instagram" key="2">
          <a :href="makerInfo.instagram" target="_blank">
            <a-icon type="instagram" /> Instagram
          </a>
        </a-button>
        <a-button v-if="makerInfo.discord" key="1">
          <a :href="makerInfo.discord" target="_blank">
            <a-icon type="discord" /> Discord
          </a>
        </a-button>
      </template>
    </a-page-header>
    <div style="padding: 16px 0">
      <a-spin tip="Loading..." :spinning="loading">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col v-for="sculpt in makerInfo.sculpts" :key="sculpt.id" :span="6">
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
      makerInfo: [],
      loading: true,
    }
  },
  async fetch() {
    this.makerInfo = await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false
        return res.result.pageContext.maker
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
