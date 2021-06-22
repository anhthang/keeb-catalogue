<template>
  <div class="container artisan-container">
    <a-page-header title="Collection">
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

      <a-row v-if="!user || !user.uid" type="flex">
        <a-alert
          class="collection-alert"
          message="You must log in before using this feature."
          banner
        />
      </a-row>

      <a-row :gutter="[16, 16]" type="flex">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
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

<style lang="less">
.collection-alert {
  margin: 0 auto;
}
</style>
