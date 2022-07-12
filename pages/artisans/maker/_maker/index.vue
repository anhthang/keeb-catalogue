<template>
  <div class="container artisan-container">
    <a-page-header
      :title="maker.name"
      :avatar="{
        props: {
          src: maker.img,
        },
      }"
    >
      <country-flag
        v-if="maker.nationality"
        slot="subTitle"
        :country="maker.nationality"
        size="small"
      />

      <template slot="extra">
        <a-button
          v-if="user.isEditor"
          key="edit"
          type="primary"
          icon="edit"
          @click="showEditMakerModal"
        >
          Edit Maker
        </a-button>
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="3" icon="global"> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2" icon="instagram"> Instagram </a-button>
        </a>
        <a v-if="maker.discord" :href="maker.discord" target="_blank">
          <a-button key="1">
            <a-icon :component="DiscordSvg" class="custom-icon" />
            Discord
          </a-button>
        </a>
        <a :href="maker.src" target="_blank">
          <a-button v-if="maker.src" key="0" icon="file-word">
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
            <nuxt-link :to="`/artisans/maker/${makerId}/${sculpt.slug}`">
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

      <a-modal
        v-model="showEditMaker"
        title="Edit Maker"
        destroy-on-close
        @ok="updateArtisanMaker"
      >
        <maker-form ref="artisanMaker" :is-edit="true" :metadata="maker" />
      </a-modal>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isEmpty } from 'lodash'
import DiscordSvg from '@/components/icons/DiscordSvg'
import MakerForm from '~/components/modals/MakerForm.vue'

export default {
  components: { MakerForm },
  asyncData({ params }) {
    return {
      makerId: params.maker,
    }
  },
  data() {
    return {
      size: this.$device.isMobile ? 'small' : 'default',
      sculpts: {},
      loading: true,
      DiscordSvg,
      showEditMaker: false,
      confirmLoading: false,
    }
  },
  async fetch() {
    if (!this.makers[this.makerId]) {
      await this.$store.dispatch('artisans/getMaker', this.makerId)
    }

    if (isEmpty(this.makers[this.makerId].sculpts)) {
      await this.$store
        .dispatch('artisans/fetchMakerDatabase', this.makerId)
        .then(() => (this.loading = false))
    } else {
      this.loading = false
    }
  },
  head() {
    return {
      title: `${this.maker.name} - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('artisans', ['makers']),
    ...mapState(['user']),
    maker() {
      return this.makers[this.makerId] || {}
    },
  },
  watch: {
    loading() {
      this.sculpts = this.makers[this.makerId]?.sculpts || {}
    },
  },
  methods: {
    showEditMakerModal() {
      this.showEditMaker = !this.showEditMaker
    },
    async updateArtisanMaker() {
      this.confirmLoading = true

      await this.$refs.artisanMaker.addMaker()

      this.confirmLoading = false
      this.showEditMaker = false
    },
  },
}
</script>
