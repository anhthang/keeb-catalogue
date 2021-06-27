<template>
  <div class="container artisan-container">
    <a-page-header :title="collectionName" @back="() => $router.go(-1)">
      <a-button slot="extra" type="primary" icon="file-add" @click="showModal">
        Add
      </a-button>
      <a-modal
        v-model="visible"
        title="Add keycap to collection"
        @ok="addToCollection"
      >
        <search-artisans :selected="selectedIds" :visible="visible" />
      </a-modal>

      <div>
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
            <a-card hoverable :title="cardTitle(colorway)">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <a-popconfirm
                slot="extra"
                title="Are you sure remove this cap?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="removeCap(colorway)"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyBy } from 'lodash'

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      visible: false,
      collectionItems: [],
    }
  },
  async fetch() {
    const doc = await this.$fire.firestore
      .collection(`users/${this.user.uid}/collections`)
      .doc(this.collection)
      .get()
      .then((doc) => doc.data())

    this.collectionItems = Object.values(doc || {})
  },
  computed: {
    ...mapState('artisans', ['addToCollectionItems', 'collections']),
    ...mapState(['user']),
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
    removeCap(clw) {
      this.collectionItems = this.collectionItems.filter((c) => c.id !== clw.id)

      const docRef = this.$fire.firestore
        .collection(`users/${this.user.uid}/collections`)
        .doc(this.collection)

      docRef
        .update({
          [clw.id]: this.$fireModule.firestore.FieldValue.delete(),
        })
        .then(() => {
          this.$message.success(`${clw.name} removed from the collection.`)
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
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
