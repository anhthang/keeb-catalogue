<template>
  <div class="container maker-container">
    <a-page-header title="Artisan Makers">
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
        title="New Maker"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="addMaker"
      >
        <maker-form ref="artisanMaker" />
      </a-modal>

      <a-divider v-if="favorite.length" orientation="left">
        Favorite
      </a-divider>
      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="maker in favorite"
          :key="maker.id"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <maker-card :favorite="true" :maker="maker" />
        </a-col>
      </a-row>

      <a-divider v-if="favorite.length" orientation="left"> Makers </a-divider>
      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="maker in otherMakers"
          :key="maker.id"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <maker-card :maker="maker" />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MakerForm from '~/components/modals/MakerForm.vue'

export default {
  components: { MakerForm },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    }
  },
  fetch() {
    this.$store.dispatch('artisans/getMakers')
  },
  head() {
    return {
      title: `Artisan Makers - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    ...mapState(['user']),
    favorite() {
      return Object.values(this.makers).filter((m) =>
        this.favoriteMakers.includes(m.id)
      )
    },
    otherMakers() {
      return Object.values(this.makers).filter(
        (m) => !this.favoriteMakers.includes(m.id)
      )
    },
  },
  methods: {
    showModal() {
      this.visible = true
    },
    async addMaker() {
      this.confirmLoading = true

      await this.$refs.artisanMaker.addMaker()

      this.confirmLoading = false
      this.visible = false

      this.$fetch()
    },
  },
}
</script>
