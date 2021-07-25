<template>
  <div class="container artisan-maker-container">
    <a-page-header title="Artisan Makers">
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
        title="Add new maker"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="addMaker"
      >
        <artisan-maker-form ref="artisanMaker" />
      </a-modal>

      <a-divider v-if="favorite.length" orientation="left">
        Favorite
      </a-divider>
      <a-row :gutter="[16, 16]" type="flex">
        <a-col
          v-for="maker in favorite"
          :key="maker.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <maker-card :favorite="true" :maker="maker" />
        </a-col>
      </a-row>

      <a-divider v-if="favorite.length" orientation="left"> Makers </a-divider>
      <a-row :gutter="[16, 16]" type="flex">
        <a-col
          v-for="maker in otherMakers"
          :key="maker.id"
          :xs="24"
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
import ArtisanMakerForm from '~/components/modals/ArtisanMakerForm.vue'

export default {
  components: { ArtisanMakerForm },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    }
  },
  fetch() {
    this.$store.dispatch('artisans/getArtisanMakers')
  },
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    ...mapState(['authenticated']),
    favorite() {
      return this.makers.filter((m) => this.favoriteMakers.includes(m.slug))
    },
    otherMakers() {
      return this.makers.filter((m) => !this.favoriteMakers.includes(m.slug))
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

<style lang="less">
.artisan-maker-container {
  text-align: center;
  flex-direction: initial;

  /** remove this if all maker had cover/logo */
  .ant-card {
    height: 100%;
  }
}
</style>
