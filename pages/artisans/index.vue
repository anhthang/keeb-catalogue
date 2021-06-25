<template>
  <div class="container artisan-maker-container">
    <a-page-header title="Artisan Makers">
      <a-button
        v-if="false"
        slot="extra"
        type="primary"
        icon="user-add"
        @click="showModal"
      >
        Add
      </a-button>
      <a-modal v-model="visible" title="Add new maker" @ok="addMaker">
        <a-form-item label="Name">
          <a-input v-model="makerName">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item label="Id">
          <a-input v-model="makerId">
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
      makerName: undefined,
      makerId: undefined,
    }
  },
  computed: {
    ...mapState('artisans', ['makers', 'favoriteMakers']),
    favorite() {
      return this.makers.filter((m) => this.favoriteMakers.includes(m.slug))
    },
    otherMakers() {
      return this.makers.filter((m) => !this.favoriteMakers.includes(m.slug))
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
        .doc()
        .set({
          name: this.makerName,
          id: this.makerId,
          slug: this.makerName.replaceAll(' ', '-').replaceAll('.', '-'),
        })
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
