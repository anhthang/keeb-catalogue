<template>
  <div class="container keyboard-maker-container">
    <a-page-header title="Keyboard Makers">
      <a-button
        v-if="authenticated"
        slot="extra"
        type="primary"
        icon="user-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal
        v-model="visible"
        title="Add keyboard maker"
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
          :xs="24"
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
                :src="maker.img"
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
    ...mapState(['authenticated']),
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

<style lang="less">
.keyboard-maker-container {
  .ant-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-cover {
    display: flex;
    align-items: center;
    flex: 1;
    background: white;
  }

  .ant-card-head-title {
    text-align: center;
  }
}
</style>
