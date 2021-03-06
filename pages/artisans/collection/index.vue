<template>
  <div class="container artisan-container">
    <a-page-header title="Collection">
      <a-button
        v-if="user.emailVerified"
        slot="extra"
        type="primary"
        icon="file-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal v-model="visible" title="New Collection" @ok="addCollection">
        <a-input v-model="collectionName" placeholder="Collection Name" />
      </a-modal>

      <conflict-sync-modal />

      <a-row v-if="!user.emailVerified" type="flex">
        <a-alert
          class="collection-alert"
          message="You must log in to sync the collections across devices. The current saved ones in local will not be synced."
          banner
        />
      </a-row>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="collection in collections"
          :key="collection.slug"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/artisans/collection/${collection.slug}`">
            <a-card hoverable :title="collection.name" />
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import slugify from 'slugify'
import ConflictSyncModal from '~/components/modals/ConflictSyncModal.vue'

export default {
  components: { ConflictSyncModal },
  data() {
    return {
      visible: false,
      collectionName: undefined,
    }
  },
  head() {
    return {
      title: `Collection - ${process.env.appName}`,
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
  },
}
</script>

<style lang="less">
.collection-alert {
  margin: 0 auto;
  margin-bottom: 16px;
}
</style>
