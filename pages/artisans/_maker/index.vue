<template>
  <div class="maker-container">
    <a-page-header
      :title="makerInfo.name"
      :avatar="{
        props: {
          src: `https://github.com/keycap-archivist/website/raw/master/src/assets/img/logos/${makerInfo.id}.jpg`,
        },
      }"
    >
      <template slot="extra">
        <a v-if="makerInfo.website" :href="makerInfo.website" target="_blank">
          <a-button key="3" icon="global" type="primary"> Website </a-button>
        </a>
        <a
          v-if="makerInfo.instagram"
          :href="makerInfo.instagram"
          target="_blank"
        >
          <a-button key="2" icon="instagram"> Instagram </a-button>
        </a>
        <a v-if="makerInfo.discord" :href="makerInfo.discord" target="_blank">
          <a-button key="1">
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
      <div>
        <a-spin tip="Loading..." :spinning="loading">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="sculpt in sculpts"
              :key="sculpt.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <nuxt-link :to="`/artisans/${maker}/${sculpt.slug}`">
                <a-card hoverable :title="sculpt.name">
                  <img
                    slot="cover"
                    loading="lazy"
                    :alt="sculpt.name"
                    :src="sculpt.preview"
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
import { mapState } from 'vuex'
import DiscordSvg from '@/components/DiscordSvg'

export default {
  layout: 'artisan',
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      makerInfo: {},
      sculpts: [],
      loading: true,
      DiscordSvg,
    }
  },
  async fetch() {
    if (!this.database[this.maker]) {
      await this.$store
        .dispatch('artisans/fetchMaker', this.maker)
        .then(() => (this.loading = false))
    } else {
      this.loading = false
    }
  },
  // fetchOnServer: false,
  computed: {
    ...mapState('artisans', ['database']),
  },
  watch: {
    loading() {
      this.makerInfo = this.database[this.maker].maker
      this.sculpts = this.database[this.maker].sculpts
    },
  },
}
</script>

<style lang="less">
.maker-container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
  max-width: 1600px;

  .ant-card-cover {
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.discord-icon {
  font-size: 16px;
  vertical-align: middle;
}

.ant-spin-nested-loading {
  min-height: 300px;
}
</style>
