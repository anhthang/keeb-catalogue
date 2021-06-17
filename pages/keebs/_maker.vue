<template>
  <div class="container">
    <a-page-header :title="maker">
      <SubmitNewKeyboard slot="extra" />
      <KeyboardList />
    </a-page-header>
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
    this.$store.dispatch('keebs/filterByMaker', this.maker)
  },
  computed: {
    ...mapState('keebs', ['statusMap']),
  },
}
</script>
