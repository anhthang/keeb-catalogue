<template>
  <div class="sculpt-container">
    <a-page-header :title="sculptInfo.name" @back="() => $router.go(-1)">
      <template slot="extra">
        <a-button key="1" icon="file-add" type="primary">
          Submit new Colorway
        </a-button>
        <a-dropdown placement="bottomRight">
          <a-menu slot="overlay" @click="onChangeSortType">
            <a-menu-item key="name">
              <a-icon type="sort-ascending" /> Sort by Name
            </a-menu-item>
            <a-menu-item key="date">
              <a-icon type="clock-circle" /> Sort by Date
            </a-menu-item>
          </a-menu>
          <a-button :icon="sortIcon"> Sort </a-button>
        </a-dropdown>
      </template>
      <div style="padding: 16px 0">
        <a-spin tip="Loading..." :spinning="loading">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col v-for="colorway in colourways" :key="colorway.id" :span="6">
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
import sortBy from 'lodash.sortby'
export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      sort: 'date',
      sortIcon: 'clock-circle',
      sculptInfo: {},
      colorways: [],
      loading: true,
      wishList: {},
      tradeList: {},
    }
  },
  async fetch() {
    await fetch(
      `https://keycap-archivist.com/page-data/maker/${this.maker}/${this.sculpt}/page-data.json`
    )
      .then((res) => res.json())
      .then((res) => {
        this.loading = false

        const { colorways, ...rest } = res.result.pageContext.sculpt

        this.sculptInfo = rest
        this.colorways = colorways
      })
      .catch(() => {
        this.loading = false
      })
  },
  computed: {
    colourways() {
      return this.sort === 'name'
        ? sortBy(this.colorways, 'name')
        : this.colorways
    },
  },
  watch: {
    sort() {
      this.sortIcon = this.sort === 'name' ? 'sort-ascending' : 'clock-circle'
    },
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
    onChangeSortType(e) {
      this.sort = e.key
    },
  },
}
</script>

<style>
.sculpt-container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}

.sculpt-container .ant-card-cover {
  height: 300px;
  overflow: hidden;
}

.sculpt-container .ant-card-cover img {
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
