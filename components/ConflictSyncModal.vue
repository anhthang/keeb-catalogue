<template>
  <a-modal
    v-model="visible"
    title="Decide which version to keep"
    :cancel-button-props="{ props: { disabled: true } }"
    :confirm-loading="confirmLoading"
    :closable="false"
    @ok="onConfirmSync"
  >
    <p>
      We have found your collections saved on both the cloud and local storage.
      Please choose one to keep, the other will be deleted.
    </p>
    <a-radio-group v-model="syncMethod" :options="['Cloud', 'Local']" />
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      syncMethod: 'Cloud',
      confirmLoading: false,
      visible: false,
    }
  },
  computed: {
    ...mapState('artisans', ['collections']),
  },
  beforeMount() {
    const hasLocalCollections =
      localStorage.getItem('KeebCatalogue_wish') ||
      localStorage.getItem('KeebCatalogue_trade')
    this.visible = this.collections.length && !!hasLocalCollections
  },
  methods: {
    onConfirmSync() {
      this.confirmLoading = true
      if (this.syncMethod === 'Cloud') {
        // delete local storage data
        localStorage.removeItem('KeebCatalogue_wish')
        localStorage.removeItem('KeebCatalogue_trade')
      } else {
        // sync local storage to cloud and delete cloud data (probably)
      }

      this.confirmLoading = false
      this.visible = false
    },
  },
}
</script>
