<template>
  <div class="container">
    <a-page-header :title="`${layoutMap[layout]} Keyboards`">
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
  computed: {
    ...mapState('keebs', ['makers', 'layoutMap']),
    ...mapState(['authenticated']),
    maker() {
      return this.makers?.[this.makerId] || {}
    },
  },
}
</script>
