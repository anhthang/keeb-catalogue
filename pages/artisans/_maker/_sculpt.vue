<template>
  <div class="artisan-container">
    <div style="padding: 16px 0">
      <a-spin tip="Loading..." :spinning="loading">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col v-for="colorway in colorways" :key="colorway.id" :span="6">
            <a-card hoverable :title="colorway.name">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <template slot="extra">
                <a-dropdown :trigger="['hover']" placement="bottomCenter">
                  <a-icon type="dash" />

                  <a-menu slot="overlay">
                    <a-menu-item key="0">Report</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <template slot="actions" class="ant-card-actions">
                <span>
                  <a-icon
                    key="heart"
                    type="heart"
                    :theme="wishList[colorway.id] ? 'twoTone' : 'outlined'"
                    two-tone-color="red"
                    @click="addWishList(colorway)"
                  />
                  Wish
                </span>
                <span>
                  <a-icon
                    key="retweet"
                    type="retweet"
                    @click="addTradeList(colorway)"
                  />
                  Trade
                </span>
              </template>
              <a-card-meta v-if="colorway.releaseDate">
                <template slot="description">
                  {{ colorway.releaseDate }}
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      colorways: [],
      loading: true,
      wishList: {},
      tradeList: {},
    }
  },
  async fetch() {
    this.colorways = await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/${this.sculpt}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false
        return res.result.pageContext.sculpt.colorways
      })
      .catch(() => {
        this.loading = false
      })
  },
  beforeMount() {
    this.wishList = JSON.parse(localStorage.getItem('KeebCal_WishList')) || {}
    this.tradeList = JSON.parse(localStorage.getItem('KeebCal_TradeList')) || {}
  },
  methods: {
    addWishList(clw) {
      if (!this.wishList[clw.id]) {
        this.wishList[clw.id] = clw
        localStorage.setItem('KeebCal_WishList', JSON.stringify(this.wishList))
      } else {
        delete this.wishList[clw.id]
        localStorage.setItem('KeebCal_WishList', JSON.stringify(this.wishList))
      }
    },
    addTradeList(clw) {
      if (!this.tradeList[clw.id]) {
        this.tradeList[clw.id] = clw
        localStorage.setItem(
          'KeebCal_TradeList',
          JSON.stringify(this.tradeList)
        )
      } else {
        delete this.tradeList[clw.id]
        localStorage.setItem(
          'KeebCal_TradeList',
          JSON.stringify(this.tradeList)
        )
      }
    },
  },
}
</script>

<style>
.artisan-container {
  text-align: center;
}

.artisan-container .ant-card-cover {
  height: 300px;
  overflow: hidden;
}

.artisan-container .ant-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ant-card-head-title {
  white-space: pre-line;
}
</style>
