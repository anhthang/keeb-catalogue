<template>
  <div class="container artisan-maker-container">
    <a-page-header title="Artisan Makers">
      <a-button
        v-if="authenticated"
        slot="extra"
        type="primary"
        icon="user-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal v-model="visible" title="Add new maker" @ok="addMaker">
        <a-form-item label="Name">
          <a-input v-model="newMaker.name">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item label="Id">
          <a-input v-model="newMaker.id">
            <a-icon slot="prefix" type="solution" />
          </a-input>
        </a-form-item>
      </a-modal>

      <div>
        <a-divider v-if="favorite.length" orientation="left">
          Favorite
        </a-divider>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="maker in favorite"
            :key="maker.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <maker-card :favorite="true" :maker="maker" />
          </a-col>
        </a-row>

        <a-divider v-if="favorite.length" orientation="left">
          Makers
        </a-divider>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="maker in otherMakers"
            :key="maker.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <maker-card :maker="maker" />
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false,
      newMaker: {
        name: undefined,
        id: undefined,
        slug: undefined,
      },
    }
  },
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    ...mapState(['authenticated']),
    favorite() {
      return this.makers.filter((m) => this.favoriteMakers.includes(m.slug))
    },
    otherMakers() {
      return this.makers.filter((m) => !this.favoriteMakers.includes(m.slug))
    },
  },
  watch: {
    'newMaker.name'() {
      this.newMaker.slug = this.makerName
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
    },
  },
  beforeMount() {
    this.$store.dispatch('artisans/getArtisanMakers')
  },
  methods: {
    showModal() {
      this.visible = true
    },
    addMaker() {
      this.$fire.firestore
        .collection('artisan-makers')
        .doc(this.newMaker.slug)
        .set(this.newMaker)
        .then(() => {
          this.visible = false
          this.$message.success('Successfully added new maker.')
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },
  },
}
</script>

<style lang="less">
.artisan-maker-container {
  text-align: center;
  flex-direction: initial;

  /** remove this if all maker had cover/logo */
  .ant-card {
    height: 100%;
  }
}
</style>
