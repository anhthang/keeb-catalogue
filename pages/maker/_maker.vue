<template>
  <div class="container">
    <div style="padding: 16px 0">
      <SubmitNewKeyboard />
    </div>
    <KeyboardList />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  fetch() {
    this.$store.dispatch('filterByMaker', this.maker)
  },
  computed: {
    ...mapState(['statusMap']),
  },
}
</script>
