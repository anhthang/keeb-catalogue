<template>
  <div class="container artisan-container">
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
              :xl="4"
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
                  <a-dropdown :trigger="['click']" placement="topCenter">
                    <a-icon type="save" />
                    <a-menu slot="overlay">
                      <a-sub-menu
                        title="Add to Collection"
                        :disabled="!collections.length"
                      >
                        <a-menu-item
                          v-for="collection in collections"
                          :key="collection.slug"
                          @click="addToCollection(collection, colorway)"
                        >
                          {{ collection.name }}
                        </a-menu-item>
                      </a-sub-menu>
                    </a-menu>
                  </a-dropdown>
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
    ...mapState('artisans', ['database', 'collections']),
    ...mapState(['user']),
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
  methods: {
    addToCollection(collection, clw) {
      this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(collection.slug)
        .update({
          [clw.id]: {
            id: clw.id,
            name: clw.name,
            img: clw.img,
            sculpt_name: this.sculptInfo.name,
          },
        })
        .then(() => {
          this.$message.success(
            `Successfully added ${clw.name} to the collection!`
          )
        })
        .catch((e) => {
          this.$message.error('Error adding sculpt to collection: ', e.message)
        })
    },
    onChangeSortType(e) {
      this.sort = e.key
    },
  },
}
</script>
