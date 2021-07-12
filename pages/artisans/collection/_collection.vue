<template>
  <div class="container artisan-container">
    <a-page-header :title="collectionName" @back="() => $router.go(-1)">
      <a-button
        v-if="authenticated"
        slot="extra"
        type="primary"
        icon="file-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal
        v-model="visible"
        title="Add keycap to collection"
        @ok="addToCollection"
      >
        <search-artisans :selected="selectedIds" :visible="visible" />
      </a-modal>

      <conflict-sync-modal />

      <a-spin :spinning="loading">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="colorway in collectionItems"
            :key="colorway.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable>
              <span slot="title" class="collection-title">
                {{ cardTitle(colorway) }}
                <a-icon
                  v-if="colorway.owned"
                  class="custom-icon"
                  :component="CheckMarkSealSvg"
                />
              </span>

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
                    <a-menu-item key="0" @click="markOwned(colorway)">
                      <a-icon
                        class="custom-icon"
                        :component="CheckMarkSealSvg"
                      />
                      Owned
                    </a-menu-item>
                    <a-menu-item key="1" @click="removeCap(colorway)">
                      <a-icon type="delete" /> Remove
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyBy, sortBy } from 'lodash'
import CheckMarkSealSvg from '@/components/icons/CheckMarkSealSvg'
import SearchArtisans from '~/components/modals/SearchArtisans.vue'

export default {
  components: { SearchArtisans },
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      collectionItems: [],
      CheckMarkSealSvg,
    }
  },
  async fetch() {
    this.loading = true
    let doc
    if (this.authenticated) {
      doc = await this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(this.collection)
        .get()
        .then((doc) => doc.data())
    } else {
      doc = JSON.parse(localStorage.getItem(`KeebCatalogue_${this.collection}`))
    }

    this.collectionItems = sortBy(Object.values(doc || {}), 'name')

    this.loading = false
  },
  computed: {
    ...mapState('artisans', ['addToCollectionItems', 'collections']),
    ...mapState(['user', 'authenticated']),
    selectedIds() {
      return this.collectionItems.map((c) => c.id)
    },
    collectionName() {
      const collection = this.collections.find(
        (c) => c.slug === this.collection
      )
      return collection?.name
    },
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    showModal() {
      this.visible = !this.visible
    },
    markOwned(clw) {
      if (this.authenticated) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(this.collection)
          .update({
            [clw.id]: { ...clw, owned: true },
          })
          .then(() => {
            this.$fetch()
            this.$message.success('Updated successfully.')
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      } else {
        const collectionMap = keyBy(this.collectionItems, 'id')
        collectionMap[clw.id].owned = true

        localStorage.setItem(
          `KeebCatalogue_${this.collection}`,
          JSON.stringify(collectionMap)
        )

        this.collectionItems = Object.values(collectionMap)
      }
    },
    removeCap(clw) {
      this.collectionItems = this.collectionItems.filter((c) => c.id !== clw.id)

      if (this.authenticated) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(this.collection)
          .update({
            [clw.id]: this.$fireModule.firestore.FieldValue.delete(),
          })
          .then(() => {
            this.$message.success(`${clw.name} removed from the collection.`)
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      } else {
        localStorage.setItem(
          `KeebCatalogue_${this.collection}`,
          JSON.stringify(keyBy(this.collectionItems, 'id'))
        )

        this.$message.success(`${clw.name} removed from the collection.`)
      }
    },
    async addToCollection() {
      const caps = await this.$store.dispatch(
        'artisans/fetchCaps',
        this.addToCollectionItems.map((i) => i.key)
      )

      const collectionMap = keyBy(this.collectionItems, 'id')

      this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(this.collection)
        .set(collectionMap)
        .then(() => {
          this.$message.success('Successfully added to collection.')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })

      this.collectionItems.push(...caps)

      this.visible = false
    },
  },
}
</script>

<style lang="less">
.collection-title {
  .custom-icon {
    color: crimson;
  }
}
</style>
