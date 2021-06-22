<template>
  <div class="container">
    <a-page-header title="Wishlist">
      <a-row :gutter="16">
        <a-col :span="6">
          <wishlist-settings />
        </a-col>
        <a-col :span="18">
          <wishlist-preview />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
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
