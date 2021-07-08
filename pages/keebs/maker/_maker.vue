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
        <a-button
          v-if="authenticated"
          key="0"
          type="primary"
          @click="showModal"
        >
          <a-icon :component="KeyboardSvg" class="custom-icon" />
          Add
        </a-button>
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="1" icon="global"> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2" icon="instagram"> Instagram </a-button>
        </a>

        <a-modal
          v-model="visible"
          title="Add new keyboard"
          :confirm-loading="confirmLoading"
          @ok="onOk"
        >
          <add-new-keyboard ref="addNewKeyboard" :maker-id="makerId" />
        </a-modal>
      </template>

      <keyboard-list :loading="loading" />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KeyboardSvg from '@/components/icons/KeyboardSvg'

export default {
  asyncData({ params }) {
    return {
      makerId: params.maker,
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      isOk: false,
      KeyboardSvg,
    }
  },
  fetch() {
    this.loading = true
    this.$store.dispatch('keebs/getKeyboardsByMaker', this.makerId).then(() => {
      this.loading = false
    })
  },
  computed: {
    ...mapState('keebs', ['makers']),
    ...mapState(['authenticated']),
    maker() {
      return this.makers?.[this.makerId] || {}
    },
  },
  methods: {
    showModal() {
      this.visible = !this.visible
    },
    async onOk() {
      this.confirmLoading = true

      await this.$refs.addNewKeyboard.addKeyboard()

      this.confirmLoading = false
      this.visible = false

      this.$fetch()
    },
  },
}
</script>
