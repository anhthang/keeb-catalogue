<template>
  <div class="container">
    <a-page-header :title="maker.name">
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
      maker_id: params.maker,
    }
  },
  fetch() {
    this.$store.dispatch('keebs/getKeyboardsByMaker', this.maker_id)
  },
  computed: {
    ...mapState('keebs', ['maker']),
  },
}
</script>
