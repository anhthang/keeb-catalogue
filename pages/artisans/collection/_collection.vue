<template>
  <div class="container maker-container">
    <a-page-header :title="collection">
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
            v-for="colorway in collections"
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

export default {
  asyncData({ params }) {
    return {
      ...params,
    }
  },
  data() {
    return {
      visible: false,
      collections: [],
    }
  },
  async fetch() {
    const doc = await this.$fire.firestore
      .collection(`artisans/${this.user.uid}/collections`)
      .doc(this.collection)
      .get()
      .then((doc) => doc.data())

    this.collections = Object.values(doc || {})
  },
  computed: {
    ...mapState('artisans', ['addToCollectionItems']),
    ...mapState(['user']),
    selectedIds() {
      return this.collections.map((c) => c.id)
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
      this.collections = this.collections.filter((c) => c.id !== clw.id)

      const docRef = this.$fire.firestore
        .collection(`artisans/${this.user.uid}/collections`)
        .doc(this.collection)

      docRef
        .update({
          [clw.id]: this.$fireModule.firestore.FieldValue.delete(),
        })
        .then(() => {
          this.$message.success(`${clw.name} removed from the collection`)
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    async addToCollection(value) {
      const caps = await this.$store.dispatch(
        'artisans/fetchCaps',
        this.addToCollectionItems.map((i) => i.key)
      )

      this.collections.push(...caps)

      this.visible = false
    },
  },
}
</script>
