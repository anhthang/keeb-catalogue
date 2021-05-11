<template>
  <div class="maker-container">
    <a-page-header :title="sculptInfo.name">
      <template slot="extra">
        <a-button key="1" disabled icon="file-add" type="primary">
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
          <a-button :icon="sortIcon"> Sort By </a-button>
        </a-dropdown>
      </template>
      <div>
        <a-spin tip="Loading..." :spinning="loading">
          <a-row :gutter="[16, 16]" type="flex">
            <a-col
              v-for="colorway in colorways"
              :key="colorway.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
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
import { mapState } from 'vuex'
import { sortBy } from 'lodash'
import { WISHLIST, TRADELIST } from '@/constants'

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
      loading: true,
      wishList: {},
      tradeList: {},
    }
  },
  async fetch() {
    if (!this.database[this.maker]) {
      await this.$store
        .dispatch('artisans/fetchMaker', this.maker)
        .then(() => (this.loading = false))
    } else {
      this.loading = false
    }
  },
  computed: {
    ...mapState('artisans', ['database']),
    colorways() {
      return this.sort === 'name'
        ? sortBy(this.sculptInfo.colorways, 'name')
        : this.sculptInfo.colorways
    },
  },
  watch: {
    sort() {
      this.sortIcon = this.sort === 'name' ? 'sort-ascending' : 'clock-circle'
    },
    loading() {
      this.sculptInfo = this.database[this.maker].sculpts[this.sculpt]
    },
  },
  beforeMount() {
    this.wishList = JSON.parse(localStorage.getItem(WISHLIST)) || {}
    this.tradeList = JSON.parse(localStorage.getItem(TRADELIST)) || {}
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
.wish-item {
  color: #eb2f96;
}

.trade-item {
  color: darkgreen;
}
</style>
