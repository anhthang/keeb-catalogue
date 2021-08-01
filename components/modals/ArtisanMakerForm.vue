<template>
  <a-form-item label="Name">
    <a-input v-model="name" placeholder="Maker Name">
      <a-icon slot="prefix" type="user" />
    </a-input>
  </a-form-item>
</template>

<script>
import crc32 from 'crc/crc32'

export default {
  data() {
    return {
      name: null,
      img: null,
      slug: null,
    }
  },
  watch: {
    name() {
      this.slug = this.name
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
        .toLowerCase()

      const id = crc32(this.name).toString(16)
      this.img = `https://github.com/keycap-archivist/website/raw/master/src/assets/img/logos/${id}.jpg`
    },
  },
  methods: {
    addMaker() {
      this.$fire.firestore
        .collection('artisan-makers')
        .doc(this.slug)
        .set({ name: this.name, img: this.img })
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
