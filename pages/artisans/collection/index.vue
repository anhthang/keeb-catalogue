<template>
  <a-page-header title="Collection" class="container maker-container">
    <a-button
      slot="extra"
      :disabled="!user || !user.uid"
      type="primary"
      icon="file-add"
      @click="showModal"
    >
      Add
    </a-button>
    <a-modal v-model="visible" title="Add new collection" @ok="addCollection">
      <a-input v-model="collectionName" placeholder="Enter collection name" />
    </a-modal>

    <a-row :gutter="[16, 16]" type="flex">
      <a-alert
        v-if="!user || !user.uid"
        message="You must log in before using this feature."
        banner
      />
      <a-col
        v-for="collection in collections"
        :key="collection.slug"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <nuxt-link :to="`/artisans/collection/${collection.slug}`">
          <a-card hoverable :title="collection.name">
            <img
              slot="cover"
              loading="lazy"
              :alt="collection.name"
              :src="getPreviewImg(collection.slug)"
            />

            <a-popconfirm
              slot="extra"
              title="Are you sure delete this collection?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="delCollection(collection.slug)"
            >
              <a-icon type="delete" />
            </a-popconfirm>
          </a-card>
        </nuxt-link>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script>
import { mapState } from 'vuex'
import { COLLECTIONS } from '@/constants'
import { sample } from 'lodash'
import slugify from 'slugify'

export default {
  data() {
    return {
      visible: false,
      collectionName: undefined,
    }
  },
  computed: {
    ...mapState('artisans', ['collections']),
    ...mapState(['user']),
  },
  methods: {
    showModal() {
      this.visible = true
    },
    getPreviewImg(slug) {
      const storage = JSON.parse(localStorage.getItem(`${COLLECTIONS}_${slug}`))
      return (
        sample(Object.values(storage || {}))?.img ??
        'https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png'
      )
    },
    addCollection() {
      const slug = slugify(this.collectionName, { lower: true })

      const isExist = this.collections.some((c) => c.slug === slug)
      if (isExist) {
        this.$message.error('Collection already exist.')
        return
      }

      this.$store.dispatch('artisans/addCollection', {
        name: this.collectionName,
        slug,
      })

      this.$fire.firestore.collection('users').doc(this.user.uid).update({
        collections: this.collections,
      })

      this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(slug)
        .set({})
        .then(() => {
          this.$message.success('Collection successfully added!')
          this.visible = false
        })
        .catch((error) => {
          this.$message.error('Error adding collection: ', error.message)
        })
    },
    delCollection(slug) {
      this.$store.dispatch('artisans/delCollection', slug)

      this.$fire.firestore.collection('users').doc(this.user.uid).update({
        collections: this.collections,
      })

      this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(slug)
        .delete()
        .then(() => {
          this.$message.success('Collection successfully deleted!')
        })
        .catch((error) => {
          this.$message.error('Error removing collection: ', error.message)
        })
    },
  },
}
</script>
