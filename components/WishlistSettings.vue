<template>
  <a-card title="Settings" size="small">
    <template slot="extra">
      <a-button type="primary" icon="save" @click="saveSettings">
        Save
      </a-button>
      <a-button
        :loading="loading"
        type="primary"
        icon="download"
        @click="generateImg"
      >
        Download
      </a-button>
    </template>

    <!-- <a-form-item label="Caps per Line">
      <a-input-number v-model="settings.caps_per_line" :min="1" :max="10" />
    </a-form-item> -->
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
      <a-input v-model="settings.social.reddit" placeholder="u/username">
        <a-icon slot="prefix" type="reddit" />
      </a-input>
    </a-form-item>
    <a-form-item label="Discord">
      <a-input v-model="settings.social.discord" placeholder="Discord#0000">
        <a-icon slot="prefix" :component="DiscordSvg" class="discord-icon" />
      </a-input>
    </a-form-item>
    <a-form-item label="QQ">
      <a-input v-model="settings.social.qq" placeholder="00000000">
        <a-icon slot="prefix" type="qq" />
      </a-input>
    </a-form-item>
  </a-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import html2canvas from 'html2canvas'
import DiscordSvg from '@/components/DiscordSvg'
import { WISHLIST, TRADELIST } from '@/constants'

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
    kaSettings() {
      return {
        capsPerLine: this.settings.caps_per_line,
        priority: {
          color: 'DarkGoldenRod',
          font: 'RedRock',
        },
        legends: {
          color: 'Orchid',
          font: 'Roboto',
        },
        title: {
          color: 'Crimson',
          font: 'RedRock',
          text: this.settings.wish.title,
        },
        tradeTitle: {
          color: 'Orchid',
          font: 'RedRock',
          text: this.settings.trade.title,
        },
        extraText: {
          color: 'Turquoise',
          font: 'Roboto',
          text: 'Willing to topup if needed',
        },
        background: {
          color: 'Black',
        },
        social: {
          reddit: this.settings.social.reddit,
          discord: this.settings.social.discord,
        },
      }
    },
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

      this.$message.success('Settings saved')
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
    async generateImg() {
      this.loading = true

      this.saveSettings()

      const wishList = JSON.parse(localStorage.getItem(WISHLIST))
      const tradeList = JSON.parse(localStorage.getItem(TRADELIST))

      const json = {
        settings: this.kaSettings,
        caps: Object.values(wishList).map((i) => ({
          id: i.id,
          isPriority: false,
          legendColor: 'Crimson',
        })),
        tradeCaps: Object.values(tradeList).map((i) => ({
          id: i.id,
          isPriority: false,
          legendColor: 'Orchid',
        })),
      }

      const base64Img = await this.$axios
        .post('https://app.keycap-archivist.com/api/v2/wishlist', json, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.loading = false
          return Buffer.from(response.data, 'binary').toString('base64')
        })
        .catch((e) => {
          this.loading = false
        })

      const link = document.createElement('a')
      link.setAttribute('download', 'wishlist.png')
      link.setAttribute('href', `data:image/png;base64,${base64Img}`)
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
