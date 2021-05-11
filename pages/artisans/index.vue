<template>
  <div class="artisan-container">
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
            <maker-card theme="twoTone" :maker="maker" />
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
            <maker-card theme="outlined" :maker="maker" />
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'artisan',
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    favorite() {
      return this.makers.filter((m) => this.favoriteMakers.includes(m.slug))
    },
    otherMakers() {
      return this.makers.filter((m) => !this.favoriteMakers.includes(m.slug))
    },
  },
}
</script>

<style>
.artisan-container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
  max-width: 1600px;
}

/** remove this if all maker had cover/logo */
.artisan-container .ant-card {
  height: 100%;
}
</style>
