<template>
  <div class="container artisan-container">
    <a-page-header :title="collection.name || 'Colllection'">
      <a-dropdown slot="extra" placement="bottomRight">
        <a-menu slot="overlay" @click="onChangeSortType">
          <a-menu-item key="sculpt_name"> Sort by Sculpt </a-menu-item>
          <a-menu-item key="name"> Sort by Colorway </a-menu-item>
        </a-menu>
        <a-button icon="sort-ascending"> Sort </a-button>
      </a-dropdown>

      <template v-if="!isPublic" slot="extra">
        <a-button
          v-if="user.emailVerified"
          type="primary"
          icon="export"
          @click="publishCollection"
        >
          {{ collection.published ? 'Republish' : 'Publish' }}
        </a-button>

        <a-button
          v-if="user.emailVerified && collection.published"
          type="danger"
          icon="import"
          @click="delPublishedCollection"
        >
          Unpublish
        </a-button>

        <a-button
          v-if="user.emailVerified"
          type="danger"
          icon="delete"
          @click="deleteCollection"
        >
          Delete
        </a-button>
      </template>

      <conflict-sync-modal />

      <a-spin :spinning="loading">
        <a-row
          v-if="collection.published && !isPublic"
          :gutter="[8, 8]"
          type="flex"
        >
          <a-col>
            This collection is published at:
            <a :href="href" target="_blank">{{ href }}</a>
          </a-col>
        </a-row>
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

              <template v-if="!isPublic" slot="actions">
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
import crc32 from 'crc/crc32'
import CheckMarkSealSvg from '@/components/icons/CheckMarkSealSvg'
import ConflictSyncModal from '~/components/modals/ConflictSyncModal.vue'

export default {
  components: { ConflictSyncModal },
  asyncData({ params }) {
    return {
      collectionId: params.collection,
      isPublic: params.collection.startsWith('p_'),
    }
  },
  data() {
    return {
      size: this.$device.isMobile ? 'small' : 'default',
      loading: false,
      collection: {},
      collectionItems: [],
      CheckMarkSealSvg,
      sort: 'sculpt_name',
    }
  },
  async fetch() {
    this.loading = true
    let doc
    if (this.isPublic) {
      doc = await this.$fire.firestore
        .collection('public-collections')
        .doc(this.collectionId)
        .get()
        .then((doc) => doc.data())
    } else if (this.user.emailVerified) {
      doc = await this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(this.collectionId)
        .get()
        .then((doc) => doc.data())
    } else {
      doc = JSON.parse(
        localStorage.getItem(`KeebCatalogue_${this.collectionId}`)
      )
    }

    this.collectionItems = sortBy(Object.values(doc || {}), 'name')

    this.loading = false
  },
  head() {
    return {
      title: this.isPublic
        ? `Collection - ${process.env.appName}`
        : `${this.collection.name} • Collection - ${process.env.appName}`,
    }
  },
  computed: {
    ...mapState('artisans', ['collections']),
    ...mapState(['user']),
    sortedCollections() {
      return sortBy(this.collectionItems, ['maker_name', this.sort])
    },
    publishId() {
      const id = crc32(`${this.user.uid}__${this.collection.name}`).toString(16)

      return `p_${id}`
    },
    href() {
      return `${process.env.appUrl}/artisans/collection/${this.publishId}`
    },
  },
  created() {
    const collection = this.collections.find(
      (c) => c.slug === this.collectionId
    )

    this.collection = collection || {}
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    markGotcha(clw) {
      if (this.user.emailVerified) {
        this.$fire.firestore
          .collection(`users/${this.user.uid}/collections`)
          .doc(this.collectionId)
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
          `KeebCatalogue_${this.collectionId}`,
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
          .doc(this.collectionId)
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
          `KeebCatalogue_${this.collectionId}`,
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
          _this.$store.dispatch('artisans/delCollection', _this.collectionId)

          _this.$fire.firestore.collection('users').doc(_this.user.uid).update({
            collections: _this.collections,
          })

          _this.$fire.firestore
            .collection(`users/${_this.user.uid}/collections`)
            .doc(_this.collectionId)
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
    publishCollection() {
      const _this = this
      this.$confirm({
        title: 'Publish',
        content: () => (
          <div>
            URL for published collection:
            <br />
            <a href={_this.href} target="_blank">
              {_this.href}
            </a>
          </div>
        ),
        okText: 'Publish',
        onOk() {
          // copy collection to public store
          _this.$fire.firestore
            .collection('public-collections')
            .doc(_this.publishId)
            .set(keyBy(_this.collectionItems, 'id'))
            .then(() => {
              _this.$message.success('Collection published.')

              // update collections
              const collections = _this.collections.map((c) => {
                if (c.slug === _this.collectionId) {
                  Object.assign(c, {
                    published: true,
                    public_id: _this.publishId,
                  })
                }

                return c
              })

              _this.$fire.firestore
                .collection('users')
                .doc(_this.user.uid)
                .update({
                  collections,
                })

              _this.$fetch()
            })
            .catch((e) => {
              _this.$message.error(e.message)
            })
        },
      })
    },
    delPublishedCollection() {
      this.$fire.firestore
        .collection('public-collections')
        .doc(this.publishId)
        .delete()
        .then(() => {
          this.$message.success('Collection unpublished!')

          // update collections
          const collections = this.collections.map((c) => {
            if (c.slug === this.collectionId) {
              delete c.published
              delete c.public_id
            }

            return c
          })

          this.$fire.firestore.collection('users').doc(this.user.uid).update({
            collections,
          })

          this.$fetch()
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },
    onChangeSortType(e) {
      this.sort = e.key
    },
  },
}
</script>
