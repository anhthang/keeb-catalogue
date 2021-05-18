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
import { COLLECTIONS } from '@/constants'

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
    wishlistSettings: {
      handler(after, before) {
        if (after.wish.collection !== before.wish.collection) {
          const list =
            JSON.parse(
              localStorage.getItem(`${COLLECTIONS}_${after.wish.collection}`)
            ) || {}

          this.draggableWishList = Object.values(list)
        }
        if (after.trade.collection !== before.trade.collection) {
          const list =
            JSON.parse(
              localStorage.getItem(`${COLLECTIONS}_${after.trade.collection}`)
            ) || {}

          this.draggableTradeList = Object.values(list)
        }
      },
      deep: true,
    },
    draggableWishList() {
      const wishList = this.draggableWishList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      const key = `${COLLECTIONS}_${this.wishlistSettings.wish.collection}`
      localStorage.setItem(key, JSON.stringify(wishList))
    },
    draggableTradeList() {
      const tradeList = this.draggableTradeList.reduce((out, clw) => {
        out[clw.id] = clw
        return out
      }, {})

      const key = `${COLLECTIONS}_${this.wishlistSettings.trade.collection}`
      localStorage.setItem(key, JSON.stringify(tradeList))
    },
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
