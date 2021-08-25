<template>
  <div>
    <a-form-item label="Name">
      <a-input v-model="maker.name" placeholder="Maker Name" :disabled="isEdit">
        <a-icon slot="prefix" type="file-text" />
      </a-input>
    </a-form-item>
    <a-form-item label="Website">
      <a-input v-model="maker.website">
        <a-icon slot="prefix" type="global" />
      </a-input>
    </a-form-item>
    <a-form-item label="Instagram">
      <a-input v-model="maker.instagram">
        <a-icon slot="prefix" type="instagram" />
      </a-input>
    </a-form-item>
    <a-form-item label="Discord">
      <a-input v-model="maker.discord">
        <a-icon slot="prefix" :component="DiscordSvg" />
      </a-input>
    </a-form-item>
    <a-form-item label="Logo">
      <a-input v-model="maker.img">
        <a-icon slot="prefix" type="file-image" />
      </a-input>
    </a-form-item>
  </div>
</template>

<script>
import slugify from 'slugify'
import DiscordSvg from '@/components/icons/DiscordSvg'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['metadata', 'isEdit'],
  data() {
    return {
      DiscordSvg,
      maker: {
        name: null,
        img: null,
        website: null,
        instagram: null,
        discord: null,
      },
    }
  },
  computed: {
    makerId() {
      return slugify(this.maker.name, { lower: true })
    },
  },
  created() {
    this.maker = { ...this.metadata }
  },
  methods: {
    addMaker() {
      this.$fire.firestore
        .collection('keyboard-makers')
        .doc(this.makerId)
        .set(this.maker)
        .then(() => {
          this.$message.success('Successfully added new maker.')
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },
  },
}
</script>
