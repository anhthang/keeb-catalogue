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
          key="edit"
          type="primary"
          icon="edit"
          @click="showEditMakerModal"
        >
          Edit
        </a-button>
        <a-button
          v-if="authenticated"
          key="0"
          type="primary"
          @click="showAddKeebModal"
        >
          <a-icon :component="KeyboardSvg" class="custom-icon" />
          Add Keeb
        </a-button>
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="1" icon="global"> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2" icon="instagram"> Instagram </a-button>
        </a>
        <a v-if="maker.discord" :href="maker.discord" target="_blank">
          <a-button key="3">
            <a-icon :component="DiscordSvg" class="custom-icon" />
            Discord
          </a-button>
        </a>

        <a-modal
          v-model="showEditMaker"
          title="Edit keyboard maker"
          destroy-on-close
          @ok="updateKeebMaker"
        >
          <keyboard-maker-form
            ref="keyboardMaker"
            :is-edit="true"
            :metadata="maker"
          />
        </a-modal>
        <a-modal
          v-model="showAddKeeb"
          title="Add new keeb"
          :confirm-loading="confirmLoading"
          destroy-on-close
          @ok="addKeyboard"
        >
          <keyboard-form ref="keyboardModal" :maker-id="makerId" />
        </a-modal>
      </template>

      <keyboard-list :loading="loading" />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KeyboardSvg from '@/components/icons/KeyboardSvg'
import DiscordSvg from '@/components/icons/DiscordSvg'
import KeyboardForm from '~/components/modals/KeyboardForm.vue'
import KeyboardMakerForm from '~/components/modals/KeyboardMakerForm.vue'

export default {
  components: { KeyboardForm, KeyboardMakerForm },
  asyncData({ params }) {
    return {
      makerId: params.maker,
    }
  },
  data() {
    return {
      showAddKeeb: false,
      showEditMaker: false,
      loading: false,
      confirmLoading: false,
      isOk: false,
      KeyboardSvg,
      DiscordSvg,
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
    showAddKeebModal() {
      this.showAddKeeb = !this.showAddKeeb
    },
    showEditMakerModal() {
      this.showEditMaker = !this.showEditMaker
    },
    async updateKeebMaker() {
      this.confirmLoading = true

      await this.$refs.keyboardMaker.addMaker()

      this.confirmLoading = false
      this.showEditMaker = false
    },
    async addKeyboard() {
      this.confirmLoading = true

      await this.$refs.keyboardModal.addKeyboard()

      this.confirmLoading = false
      this.showAddKeeb = false

      this.$fetch()
    },
  },
}
</script>
