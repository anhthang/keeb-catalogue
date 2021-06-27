<template>
  <div class="container">
    <a-page-header
      :title="maker.name"
      :avatar="{
        props: {
          src: `${maker.img}`,
        },
      }"
    >
      <template slot="extra">
        <!-- <SubmitNewKeyboard /> -->
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="1" icon="global" type="primary"> Website </a-button>
        </a>
      </template>
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
    ...mapState('keebs', ['makers']),
    maker() {
      return this.makers?.[this.maker_id] || {}
    },
  },
}
</script>
