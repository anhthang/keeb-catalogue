<template>
  <div class="container artisan-container">
    <a-page-header title="Artisan Makers">
      <div>
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

        <a-divider v-if="favorite.length" orientation="left">
          Makers
        </a-divider>
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
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    ...mapState(['user']),
    favorite() {
      return this.makers.filter((m) => this.favoriteMakers.includes(m.slug))
    },
    otherMakers() {
      return this.makers.filter((m) => !this.favoriteMakers.includes(m.slug))
    },
  },
  beforeMount() {
    this.$store.dispatch('artisans/getArtisanMakers')
    this.$store.dispatch('artisans/getUserDocument', this.user.uid)
  },
}
</script>
