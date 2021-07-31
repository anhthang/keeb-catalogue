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
        <keyboard-maker-form ref="keyboardMaker" />
      </a-modal>

      <a-row :gutter="[16, 16]" type="flex">
        <a-col
          v-for="[makerId, maker] in keebMakers"
          :key="makerId"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/keebs/maker/${makerId}`">
            <a-card hoverable :title="maker.name">
              <img
                slot="cover"
                loading="lazy"
                :alt="maker.name"
                :src="maker.img || 'https://i.imgur.com/wYMcZiI.png'"
              />
            </a-card>
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script>
import { sortBy } from 'lodash'
import { mapState } from 'vuex'
import KeyboardMakerForm from '~/components/modals/KeyboardMakerForm.vue'

export default {
  components: { KeyboardMakerForm },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    }
  },
  fetch() {
    this.$store.dispatch('keebs/getMakers')
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
