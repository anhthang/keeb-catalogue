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

      <a-button
        v-if="authenticated"
        slot="extra"
        type="danger"
        icon="delete"
        @click="deleteCollection"
      >
        Delete
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
            v-for="colorway in sortedCollections"
            :key="colorway.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="cardTitle(colorway)">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />

              <template slot="actions">
                <div
                  v-if="colorway.owned"
                  class="owned-cap"
                  @click="markOwned(colorway)"
                >
                  <a-icon class="custom-icon" :component="CheckMarkSealSvg" />
                  Owned
                </div>
                <div v-else @click="markOwned(colorway)">
                  <a-icon class="custom-icon" :component="CheckMarkSealSvg" />
                  Owned
                </div>
                <div class="remove-cap" @click="removeCap(colorway)">
                  <a-icon type="delete" /> Remove
                </div>
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
    sortedCollections() {
      return sortBy(this.collectionItems, ['maker_name', 'sculpt_name'])
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
            this.$message.success('Updated successfully.')
            this.$fetch()
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
    deleteCollection() {
      const _this = this
      this.$confirm({
        title: 'Delete Collection?',
        content: 'When you delete this collection, the items will be deleted.',
        okText: 'Delete',
        onOk() {
          _this.$store.dispatch('artisans/delCollection', _this.collection)

          _this.$fire.firestore.collection('users').doc(_this.user.uid).update({
            collections: _this.collections,
          })

          _this.$fire.firestore
            .collection(`users/${_this.user.uid}/collections`)
            .doc(_this.collection)
            .delete()
            .then(() => {
              _this.$message.success('Collection successfully deleted!')
              _this.$router.go(-1)
            })
            .catch((error) => {
              _this.$message.error('Error removing collection: ', error.message)
            })
        },
      })
    },
  },
}
</script>

<style lang="less">
.owned-cap {
  color: #52c41a;
}

.remove-cap:hover {
  color: #d32029;
}
</style>
