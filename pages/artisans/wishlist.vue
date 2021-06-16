<template>
  <a-page-header title="Wishlist" class="wishlist">
    <a-row :gutter="16">
      <a-col :span="6">
        <wishlist-settings />
      </a-col>
      <a-col :span="18">
        <wishlist-preview />
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script>
import { mapMutations } from 'vuex'
import { WISHLIST_SETTINGS } from '@/constants'

export default {
  fetch() {
    const json = JSON.parse(localStorage.getItem(WISHLIST_SETTINGS))
    if (json?.caps_per_line) {
      this.WISHLIST_SETTINGS(json)
    }
  },
  methods: {
    ...mapMutations('artisans', ['WISHLIST_SETTINGS']),
  },
}
</script>

<style lang="less">
.wishlist {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1600px;

  .ant-card-cover {
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
