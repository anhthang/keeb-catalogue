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
        <a-button key="0" type="primary" @click="showModal">
          <a-icon
            :component="KeyboardSvg"
            class="discord-icon"
            style="margin-top: -6px"
          />
          Add
        </a-button>
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="1" icon="global"> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2" icon="instagram"> Instagram </a-button>
        </a>

        <a-modal v-model="visible" title="Add new keyboard">
          <add-new-keyboard :maker-id="maker_id" />
        </a-modal>
      </template>
      <KeyboardList />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KeyboardSvg from '@/components/icons/KeyboardSvg'

export default {
  asyncData({ params }) {
    return {
      maker_id: params.maker,
    }
  },
  data() {
    return {
      visible: false,
      KeyboardSvg,
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
  methods: {
    showModal() {
      this.visible = !this.visible
    },
  },
}
</script>
