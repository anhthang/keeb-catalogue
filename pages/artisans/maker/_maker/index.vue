<template>
  <div class="container artisan-container">
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
          <a-button key="3" icon="global"> Website </a-button>
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
            <a-icon :component="DiscordSvg" class="custom-icon" />
            Discord
          </a-button>
        </a>
        <a :href="makerInfo.src" target="_blank">
          <a-button v-if="makerInfo.src" key="0" icon="file-word">
            Catalog
          </a-button>
        </a>
      </template>

      <a-spin :spinning="loading">
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="sculpt in sculpts"
            :key="sculpt.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <nuxt-link :to="`/artisans/maker/${maker}/${sculpt.slug}`">
              <a-card hoverable :title="sculpt.name" :size="size">
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
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DiscordSvg from '@/components/icons/DiscordSvg'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      size: this.$device.isMobile ? 'small' : 'default',
      makerInfo: {},
      sculpts: [],
      loading: true,
      DiscordSvg,
    }
  },
  async fetch() {
    if (!this.database[this.maker]) {
      await this.$store
        .dispatch('artisans/fetchMakerDatabase', this.maker)
        .then(() => (this.loading = false))
    } else {
      this.loading = false
    }
  },
  head() {
    return {
      title: `${this.makerInfo.name} - ${process.env.appName}`,
    }
  },
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
