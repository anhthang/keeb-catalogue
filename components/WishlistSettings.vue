<template>
  <a-card title="Settings" size="small">
    <template slot="extra">
      <a-button
        :loading="loading"
        type="primary"
        icon="download"
        @click="downloadWishlist"
      >
        Download
      </a-button>
    </template>
  </a-card>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async downloadWishlist() {
      this.loading = true

      const el = document.getElementsByClassName('wishlist-preview')[0]

      const options = {
        type: 'dataURL',
        useCORS: true,
      }
      const printCanvas = await html2canvas(el, options)

      const link = document.createElement('a')
      link.setAttribute('download', 'wishlist.png')
      link.setAttribute(
        'href',
        printCanvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')
      )
      link.click()

      this.loading = false
    },
  },
}
</script>
