<template>
  <div class="artisan-container">
    <a-page-header :title="makerInfo.name" @back="() => $router.go(-1)">
      <template slot="extra">
        <a :href="makerInfo.website" target="_blank">
          <a-button
            v-if="makerInfo.website"
            key="3"
            icon="global"
            type="primary"
          >
            Website
          </a-button>
        </a>
        <a :href="makerInfo.instagram" target="_blank">
          <a-button v-if="makerInfo.instagram" key="2" icon="instagram">
            Instagram
          </a-button>
        </a>
        <a :href="makerInfo.discord" target="_blank">
          <a-button v-if="makerInfo.discord" key="1">
            <a-icon :component="DiscordSvg" class="discord-icon" />
            Discord
          </a-button>
        </a>
        <a :href="makerInfo.src" target="_blank">
          <a-button v-if="makerInfo.src" key="0" icon="file-word">
            Catalog
          </a-button>
        </a>
      </template>
      <div style="padding: 16px 0">
        <a-spin tip="Loading..." :spinning="loading">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="sculpt in makerInfo.sculpts"
              :key="sculpt.id"
              :span="6"
            >
              <nuxt-link :to="`/artisans${sculpt.link.replace('/maker', '')}`">
                <a-card hoverable :title="sculpt.name">
                  <img
                    slot="cover"
                    :alt="sculpt.name"
                    :src="sculpt.previewImg"
                  />
                </a-card>
              </nuxt-link>
            </a-col>
          </a-row>
        </a-spin>
      </div>
    </a-page-header>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import DiscordSvg from '~/components/DiscordSvg.vue'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      makerInfo: {},
      loading: true,
      DiscordSvg,
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
  margin: 0 auto;
  min-height: 100vh;
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

.discord-icon {
  font-size: 18px;
  vertical-align: middle;
}
</style>
