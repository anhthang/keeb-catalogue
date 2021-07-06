<template>
  <div class="container">
    <a-page-header :title="`${layoutMap[layout]} Keyboards`">
      <KeyboardList />
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
      KeyboardSvg,
    }
  },
  fetch() {
    this.$store.dispatch('keebs/getKeyboardsByLayout', this.layout)
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
