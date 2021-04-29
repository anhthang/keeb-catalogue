<template>
  <a-card :title="false">
    <div class="wishlist-preview">
      <a-divider>{{ wishlistSettings.wish.title }}</a-divider>
      <a-row :gutter="[16, 16]">
        <draggable :list="draggableWishList" group="group">
          <a-col
            v-for="colorway in draggableWishList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="colorway.name" size="small" :bordered="false">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>

      <a-divider v-if="draggableTradeList.length">
        {{ wishlistSettings.trade.title }}
      </a-divider>
      <a-row v-if="draggableTradeList.length" :gutter="[16, 16]">
        <draggable :list="draggableTradeList" group="group">
          <a-col
            v-for="colorway in draggableTradeList"
            :key="colorway.id"
            :span="6"
          >
            <a-card :title="colorway.name" size="small" :bordered="false">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>
    </div>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      draggableTradeList: [],
      draggableWishList: [],
    }
  },
  computed: {
    ...mapState('artisans', ['wishlistSettings']),
  },
  beforeMount() {
    const wishList = JSON.parse(localStorage.getItem('KeebCal_wishList')) || {}
    const tradeList =
      JSON.parse(localStorage.getItem('KeebCal_tradeList')) || {}

    this.draggableWishList = Object.values(wishList)
    this.draggableTradeList = Object.values(tradeList)
  },
}
</script>

<style>
.wishlist-preview .ant-card-head-title {
  text-align: center;
}
</style>
