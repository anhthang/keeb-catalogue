<template>
  <div>
    <a-form-item label="Name">
      <a-input v-model="maker.name">
        <a-icon slot="prefix" type="user" />
      </a-input>
    </a-form-item>
    <a-form-item label="Id">
      <a-input v-model="maker.id" disabled>
        <a-icon slot="prefix" type="solution" />
      </a-input>
    </a-form-item>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import crc32 from 'crc/crc32'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['metadata'],
  data() {
    return {
      maker: {
        name: null,
        id: null,
        slug: null,
      },
    }
  },
  watch: {
    'maker.name'() {
      this.maker.slug = this.maker.name
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
        .toLowerCase()

      this.maker.id = crc32(this.maker.name).toString(16)
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
        .doc(this.maker.slug)
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
