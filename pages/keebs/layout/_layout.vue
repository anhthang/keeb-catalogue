<template>
  <div class="container">
    <a-page-header :title="pageTitle">
      <keyboard-list :loading="loading" />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KeyboardSvg from '@/components/icons/KeyboardSvg'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      loading: false,
      KeyboardSvg,
    }
  },
  fetch() {
    this.loading = true
    this.$store.dispatch('keebs/getKeyboardsByLayout', this.layout).then(() => {
      this.loading = false
    })
  },
  head() {
    return {
      title: `${this.pageTitle} - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('keebs', ['makers', 'layoutMap']),
    maker() {
      return this.makers?.[this.makerId] || {}
    },
    pageTitle() {
      return `${this.layoutMap[this.layout]} Keyboards`
    },
  },
}
</script>
