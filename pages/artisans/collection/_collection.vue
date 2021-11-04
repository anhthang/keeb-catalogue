<template>
  <div class="container artisan-container">
    <a-page-header :title="collectionName">
      <a-dropdown slot="extra" placement="bottomRight">
        <a-menu slot="overlay" @click="onChangeSortType">
          <a-menu-item key="sculpt_name"> Sort by Sculpt </a-menu-item>
          <a-menu-item key="name"> Sort by Colorway </a-menu-item>
        </a-menu>
        <a-button icon="sort-ascending"> Sort </a-button>
      </a-dropdown>

      <a-button
        v-if="user.emailVerified"
        slot="extra"
        type="danger"
        icon="delete"
        @click="deleteCollection"
      >
        Delete
      </a-button>

      <conflict-sync-modal />

      <a-spin :spinning="loading">
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in sortedCollections"
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="cardTitle(colorway)" :size="size">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />

              <template slot="actions">
                <div
                  v-if="colorway.gotcha"
                  class="gotcha-cap"
                  @click="markGotcha(colorway)"
                >
                  <a-icon class="custom-icon" :component="CheckMarkSealSvg" />
                  Gotcha
                </div>
                <div v-else @click="markGotcha(colorway)">
                  <a-icon class="custom-icon" :component="CheckMarkSealSvg" />
                  Gotcha
                </div>
                <div class="release-cap" @click="releaseCap(colorway)">
                  <a-icon type="delete" /> Release
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
      size: this.$device.isMobile ? 'small' : 'default',
      loading: false,
      collectionItems: [],
      CheckMarkSealSvg,
      sort: 'sculpt_name',
    }
  },
  async fetch() {
    this.loading = true
    let doc
    if (this.user.emailVerified) {
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
  head() {
    return {
      title: `${this.collectionName} • Collection - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('artisans', ['collections']),
    ...mapState(['user']),
    collectionName() {
      const collection = this.collections.find(
        (c) => c.slug === this.collection
      )
      return collection?.name
    },
    sortedCollections() {
      return sortBy(this.collectionItems, ['maker_name', this.sort])
    },
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    markGotcha(clw) {
      if (this.user.emailVerified) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(this.collection)
          .update({
            [clw.id]: { ...clw, gotcha: true },
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
        collectionMap[clw.id].gotcha = true

        localStorage.setItem(
          `KeebCatalogue_${this.collection}`,
          JSON.stringify(collectionMap)
        )

        this.collectionItems = Object.values(collectionMap)
      }
    },
    releaseCap(clw) {
      this.collectionItems = this.collectionItems.filter((c) => c.id !== clw.id)

      if (this.user.emailVerified) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(this.collection)
          .update({
            [clw.id]: this.$fireModule.firestore.FieldValue.delete(),
          })
          .then(() => {
            this.$message.success(
              `${this.cardTitle(clw)} released from the collection.`
            )
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      } else {
        localStorage.setItem(
          `KeebCatalogue_${this.collection}`,
          JSON.stringify(keyBy(this.collectionItems, 'id'))
        )

        this.$message.success(
          `${this.cardTitle(clw)} released from the collection.`
        )
      }
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
    onChangeSortType(e) {
      this.sort = e.key
    },
  },
}
</script>
