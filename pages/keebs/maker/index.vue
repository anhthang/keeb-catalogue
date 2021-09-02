<template>
  <div class="container maker-container">
    <a-page-header title="Keyboard Makers">
      <a-button
        v-if="user.isAdmin"
        slot="extra"
        type="primary"
        icon="user-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal
        v-model="visible"
        title="Add Maker"
        :confirm-loading="confirmLoading"
        destroy-on-close
        @ok="addMaker"
      >
        <maker-form ref="keyboardMaker" :is-keeb="true" />
      </a-modal>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="[makerId, maker] in keebMakers"
          :key="makerId"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <maker-card :maker="maker" :is-keeb="true" />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script>
import { sortBy } from 'lodash'
import { mapState } from 'vuex'
import MakerForm from '~/components/modals/MakerForm.vue'
import MakerCard from '~/components/MakerCard.vue'

export default {
  components: { MakerForm, MakerCard },
  data() {
    return {
      size: this.$device.isMobile ? 'small' : 'default',
      visible: false,
      confirmLoading: false,
    }
  },
  fetch() {
    this.$store.dispatch('keebs/getMakers')
  },
  head() {
    return {
      title: `Keyboard Makers - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('keebs', ['makers']),
    ...mapState(['user']),
    keebMakers() {
      return sortBy(Object.entries(this.makers), (i) => i[0])
    },
  },
  methods: {
    showModal() {
      this.visible = !this.visible
    },
    async addMaker() {
      this.confirmLoading = true

      await this.$refs.keyboardMaker.addMaker()

      this.confirmLoading = false
      this.visible = false

      this.$fetch()
    },
  },
}
</script>
