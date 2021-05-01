<template>
  <a-card :title="false">
    <div class="wishlist-preview">
      <a-divider v-if="draggableWishList.length">
        {{ wishlistSettings.wish.title }}
      </a-divider>
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
              <a-button
                slot="extra"
                icon="close-circle"
                size="small"
                type="link"
                @click="removeCap(colorway, 'wish')"
              />
            </a-card>
          </a-col>
        </draggable>
      </a-row>

      <a-divider v-if="draggableTradeList.length">
        {{ wishlistSettings.trade.title }}
      </a-divider>
      <a-row :gutter="[16, 16]">
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
              <a-button
                slot="extra"
                icon="close-circle"
                size="small"
                type="link"
                @click="removeCap(colorway, 'trade')"
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
import { WISHLIST, TRADELIST } from '@/constants'

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
  watch: {
    draggableWishList() {
      const wishList = this.draggableWishList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      localStorage.setItem(WISHLIST, JSON.stringify(wishList))
    },
    draggableTradeList() {
      const tradeList = this.draggableTradeList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      localStorage.setItem(TRADELIST, JSON.stringify(tradeList))
    },
  },
  beforeMount() {
    const wishList = JSON.parse(localStorage.getItem(WISHLIST)) || {}
    const tradeList = JSON.parse(localStorage.getItem(TRADELIST)) || {}

    this.draggableWishList = Object.values(wishList)
    this.draggableTradeList = Object.values(tradeList)
  },
  methods: {
    removeCap(colorway, type) {
      const vm = this
      this.$confirm({
        title: 'Do you want to remove this keycap?',
        content: 'Once confirmed, this action cannot be undone.',
        onOk() {
          if (type === 'wish') {
            vm.draggableWishList = vm.draggableWishList.filter(
              (i) => i.id !== colorway.id
            )
          } else {
            vm.draggableTradeList = vm.draggableTradeList.filter(
              (i) => i.id !== colorway.id
            )
          }
        },
      })
    },
  },
}
</script>

<style>
.wishlist-preview .ant-card-head-title {
  text-align: center;
}
</style>
