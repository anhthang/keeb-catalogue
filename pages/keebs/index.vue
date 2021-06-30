<template>
  <div class="container keyboard-maker-container">
    <a-page-header title="Keyboard Makers">
      <a-button slot="extra" type="primary" icon="user-add" @click="showModal">
        Add
      </a-button>
      <a-modal v-model="visible" title="Add new maker" @ok="addMaker">
        <a-form-item label="Name">
          <a-input v-model="newMaker.name">
            <a-icon slot="prefix" type="file-text" />
          </a-input>
        </a-form-item>
        <a-form-item label="Website">
          <a-input v-model="newMaker.website">
            <a-icon slot="prefix" type="global" />
          </a-input>
        </a-form-item>
        <a-form-item label="Instagram">
          <a-input v-model="newMaker.instagram">
            <a-icon slot="prefix" type="instagram" />
          </a-input>
        </a-form-item>
        <a-form-item label="Logo">
          <a-input v-model="newMaker.img">
            <a-icon slot="prefix" type="file-image" />
          </a-input>
        </a-form-item>
      </a-modal>

      <a-row :gutter="[16, 16]" type="flex">
        <a-col
          v-for="[makerId, maker] in Object.entries(makers)"
          :key="makerId"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/keebs/${makerId}`">
            <a-card hoverable :title="maker.name">
              <img
                slot="cover"
                loading="lazy"
                :alt="maker.name"
                :src="maker.img"
              />
            </a-card>
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script>
import slugify from 'slugify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false,
      newMaker: {
        name: null,
        img: null,
        website: null,
        instagram: null,
      },
    }
  },
  fetch() {
    this.$store.dispatch('keebs/getMakers')
  },
  computed: {
    ...mapState('keebs', ['makers']),
    newMakerId() {
      return slugify(this.newMaker.name, { lower: true })
    },
  },
  methods: {
    showModal() {
      this.visible = !this.visible
    },
    addMaker() {
      this.$fire.firestore
        .collection('keyboard-makers')
        .doc(this.newMakerId)
        .set(this.newMaker)
        .then(() => {
          this.visible = false
          this.$message.success('Successfully added new maker.')
          this.$fetch()
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },
  },
}
</script>

<style lang="less">
.keyboard-maker-container {
  .ant-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-cover {
    display: flex;
    align-items: center;
    flex: 1;
    background: white;
  }

  .ant-card-head-title {
    text-align: center;
  }
}
</style>
