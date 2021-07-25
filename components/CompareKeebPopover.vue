<template>
  <div>
    <a-alert
      v-if="compareKeebs.length === 3"
      type="error"
      message="You may select up to 3 items for compare."
      banner
    />
    <a-list item-layout="horizontal" :data-source="compareKeebs">
      <a-list-item slot="renderItem" slot-scope="kb">
        <a-icon slot="actions" type="delete" @click="removeKeeb(kb)" />

        <a-list-item-meta :title="kb.name">
          <a-avatar slot="avatar" :src="kb.img" />
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <nuxt-link to="/keebs/compare">
      <a-button type="primary" icon="diff" :disabled="disabled">
        Compare
      </a-button>
    </nuxt-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('keebs', ['compareKeebs']),
    disabled() {
      return this.compareKeebs.length < 2 || this.compareKeebs.length > 3
    },
  },
  methods: {
    removeKeeb(keeb) {
      this.$store.dispatch('keebs/removeFromCompare', keeb)
    },
  },
}
</script>
