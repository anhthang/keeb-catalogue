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

      <a-spin :spinning="loading">
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
            <a-card hoverable :title="colorway.name || '-'">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />

              <template slot="actions">
                <a-dropdown :trigger="['click']" placement="topCenter">
                  <div><a-icon type="save" /> Add to Collection</div>
                  <a-menu slot="overlay">
                    <a-menu-item
                      v-for="collection in collections"
                      :key="collection.slug"
                      :disabled="!collections.length"
                      @click="addToCollection(collection, colorway)"
                    >
                      {{ collection.name }}
                    </a-menu-item>
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

      <conflict-sync-modal />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sortBy } from 'lodash'
import ConflictSyncModal from '~/components/modals/ConflictSyncModal.vue'

export default {
  components: { ConflictSyncModal },
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
      makerInfo: {},
      loading: true,
    }
  },
  async fetch() {
    if (!this.database[this.maker]) {
      await this.$store
        .dispatch('artisans/fetchMakerDatabase', this.maker)
        .then(() => (this.loading = false))
    } else {
      this.loading = false
    }
  },
  computed: {
    ...mapState('artisans', ['database', 'collections']),
    ...mapState(['user', 'authenticated']),
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
      this.makerInfo = this.database[this.maker].maker
    },
  },
  methods: {
    addToCollection(collection, clw) {
      const colorway = {
        id: clw.id,
        name: clw.name,
        img: clw.img,
        sculpt_name: this.sculptInfo.name,
        maker_name: this.makerInfo.name,
      }

      if (this.authenticated) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(collection.slug)
          .update({
            [clw.id]: colorway,
          })
          .then(() => {
            this.$message.success(`Added ${clw.name} to ${collection.name}`)
          })
          .catch((e) => {
            this.$message.error('Adding sculpt to collection err: ', e.message)
          })
      } else {
        const collectionMap =
          JSON.parse(
            localStorage.getItem(`KeebCatalogue_${collection.slug}`)
          ) || {}

        collectionMap[clw.id] = colorway

        localStorage.setItem(
          `KeebCatalogue_${collection.slug}`,
          JSON.stringify(collectionMap)
        )

        this.$message.success(`Added ${clw.name} to ${collection.name}`)
      }
    },
    onChangeSortType(e) {
      this.sort = e.key
    },
  },
}
</script>
