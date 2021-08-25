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
      <a-input v-model="maker.img" disabled>
        <a-icon slot="prefix" type="file-image" />
      </a-input>
    </a-form-item>
  </div>
</template>

<script>
import crc32 from 'crc/crc32'
import { isEmpty } from 'lodash'
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
      slug: null,
    }
  },
  watch: {
    'maker.name'() {
      this.slug = this.maker.name
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
        .toLowerCase()

      const id = crc32(this.maker.name).toString(16)
      this.maker.img = `https://github.com/keycap-archivist/website/raw/master/src/assets/img/logos/${id}.jpg`
    },
  },
  created() {
    if (!isEmpty(this.metadata)) {
      this.maker = { ...this.metadata }
    }
  },
  methods: {
    addMaker() {
      this.$fire.firestore
        .collection('artisan-makers')
        .doc(this.slug)
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
