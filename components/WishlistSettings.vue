<template>
  <a-card title="Settings" size="small">
    <template slot="extra">
      <a-button type="primary" icon="save" @click="saveSettings">Save</a-button>
      <a-button
        :loading="loading"
        type="primary"
        icon="download"
        @click="downloadWishlist"
      >
        Download
      </a-button>
    </template>

    <a-form-item label="Caps per Line">
      <a-input-number v-model="settings.caps_per_line" :min="1" :max="10" />
    </a-form-item>
    <a-form-item label="Wish Title">
      <a-input v-model="settings.wish.title">
        <a-icon slot="prefix" type="font-size" />
      </a-input>
    </a-form-item>
    <a-form-item label="Trade Title">
      <a-input v-model="settings.trade.title">
        <a-icon slot="prefix" type="font-size" />
      </a-input>
    </a-form-item>
    <a-form-item label="Reddit">
      <a-input v-model="settings.reddit" placeholder="u/username">
        <a-icon slot="prefix" type="reddit" />
      </a-input>
    </a-form-item>
    <a-form-item label="Discord">
      <a-input v-model="settings.discord" placeholder="discord#0000">
        <a-icon slot="prefix" :component="DiscordSvg" class="discord-icon" />
      </a-input>
    </a-form-item>
  </a-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import html2canvas from 'html2canvas'
import DiscordSvg from '~/components/DiscordSvg.vue'

export default {
  data() {
    return {
      DiscordSvg,
      loading: false,
      settings: {},
    }
  },
  fetch() {
    this.settings = this.wishlistSettings
  },
  computed: {
    ...mapState('artisans', ['wishlistSettings']),
  },
  watch: {
    settings: {
      handler(val) {
        this.WISHLIST_SETTINGS(JSON.parse(JSON.stringify(val)))
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('artisans', ['WISHLIST_SETTINGS']),
    saveSettings() {
      localStorage.setItem(
        'KeebCal_WishlistSettings',
        JSON.stringify(this.settings)
      )
    },
    async downloadWishlist() {
      this.loading = true

      this.saveSettings()

      const el = document.getElementsByClassName('wishlist-preview')[0]

      const options = {
        type: 'dataURL',
        useCORS: true,
        logging: false,
      }
      const canvas = await html2canvas(el, options)

      const link = document.createElement('a')
      link.setAttribute('download', 'wishlist.png')
      link.setAttribute(
        'href',
        canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      )
      link.click()

      this.loading = false
    },
  },
}
</script>

<style>
.ant-input-number {
  width: 100%;
}
</style>
