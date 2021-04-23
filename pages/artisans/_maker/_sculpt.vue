<template>
  <div class="artisan-container">
    <a-page-header :title="sculpt.name" @back="() => $router.go(-1)">
      <template slot="extra">
        <a-button key="1" type="primary">
          <a-icon type="file-add" /> Submit new Colorway
        </a-button>
      </template>
      <div style="padding: 16px 0">
        <a-spin tip="Loading..." :spinning="loading">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="colorway in sculpt.colorways"
              :key="colorway.id"
              :span="6"
            >
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
                  <span
                    :class="wishList[colorway.id] ? 'wish-item' : ''"
                    @click="addToList(colorway, 'wish')"
                  >
                    <a-icon key="heart" type="heart" />
                    Wish
                  </span>
                  <span
                    :class="tradeList[colorway.id] ? 'trade-item' : ''"
                    @click="addToList(colorway, 'trade')"
                  >
                    <a-icon key="retweet" type="retweet" />
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
    </a-page-header>
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
      sculpt: [],
      loading: true,
      wishList: {},
      tradeList: {},
    }
  },
  async fetch() {
    this.sculpt = await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/${this.sculpt}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false
        return res.result.pageContext.sculpt
      })
      .catch(() => {
        this.loading = false
      })
  },
  beforeMount() {
    this.wishList = JSON.parse(localStorage.getItem('KeebCal_wishList')) || {}
    this.tradeList = JSON.parse(localStorage.getItem('KeebCal_tradeList')) || {}
  },
  methods: {
    async addToList(clw, type) {
      const listType = type === 'wish' ? 'wishList' : 'tradeList'
      const otherListType = type === 'trade' ? 'wishList' : 'tradeList'

      const list = this[listType]
      const otherList = this[otherListType]
      if (!list[clw.id]) {
        if (otherList[clw.id]) {
          delete otherList[clw.id]
        }
        list[clw.id] = clw
      } else {
        delete list[clw.id]
      }

      this[listType] = { ...list }
      this[otherListType] = { ...otherList }

      localStorage.setItem(`KeebCal_${listType}`, JSON.stringify(list))
      localStorage.setItem(
        `KeebCal_${otherListType}`,
        JSON.stringify(otherList)
      )

      /**
       * FIXME
       * https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
       */
      await this.$nextTick()
    },
  },
}
</script>

<style>
.artisan-container {
  margin: 0 auto;
  min-height: 100vh;
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

.wish-item {
  color: hotpink;
}

.trade-item {
  color: darkgreen;
}
</style>
