<template>
  <div class="add-new-keyboard">
    <a-form-item label="Name">
      <a-input v-model="keyboard.name">
        <a-icon slot="prefix" type="font-size" />
      </a-input>
    </a-form-item>
    <a-form-item label="Identity">
      <a-input-group>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input v-model="keyboard.maker_id" disabled>
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-col>
          <a-col :span="12">
            <a-input v-model="keyboard.keyboard_id" disabled>
              <a-icon slot="prefix" :component="KeyboardSvg" />
            </a-input>
          </a-col>
        </a-row>
      </a-input-group>
    </a-form-item>
    <a-form-item label="Description">
      <a-textarea
        v-model="keyboard.description"
        :auto-size="{ minRows: 1, maxRows: 5 }"
      />
    </a-form-item>
    <a-form-item label="Date">
      <a-range-picker @change="onSelectDate">
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
    </a-form-item>
    <a-form-item label="Url">
      <a-input v-model="keyboard.url">
        <a-icon slot="prefix" type="global" />
      </a-input>
    </a-form-item>
    <a-form-item label="Image URL">
      <a-input v-model="keyboard.img">
        <a-icon slot="prefix" type="file-image" />
      </a-input>
    </a-form-item>
    <a-form-item label="geekhack">
      <a-input v-model="keyboard.geekhack">
        <a-icon slot="prefix" type="link" />
      </a-input>
    </a-form-item>
    <a-form-item label="Layout">
      <a-select v-model="keyboard.layout">
        <a-select-option
          v-for="layout in layouts"
          :key="layout"
          :value="layout"
        >
          {{ layout }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Status">
      <a-select v-model="keyboard.status">
        <a-select-option
          v-for="status in statuses"
          :key="status"
          :value="status"
        >
          {{ status }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script>
import slugify from 'slugify'
import KeyboardSvg from './icons/KeyboardSvg.vue'

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    makerId: String,
  },
  data() {
    return {
      keyboard: {
        name: null,
        description: null,
        start: null,
        end: null,
        img: null,
        geekhack: null,
        keyboard_id: null,
        maker_id: this.makerId,
        layout: null,
        status: null,
        url: null,
      },
      statuses: ['Live', 'Shipped', 'Closed'],
      layouts: ['40%', 'HHKB', '60%', '65%', '75%', 'TKL'],
      KeyboardSvg,
    }
  },
  watch: {
    'keyboard.name'(val) {
      this.keyboard.keyboard_id = slugify(val, { lower: true })
    },
  },
  methods: {
    onSelectDate(date, dateString) {
      this.keyboard.start = dateString[0]
      this.keyboard.end = dateString[1]
    },
    addKeyboard() {
      this.$fire.firestore
        .collection('keyboards')
        .doc(`${this.keyboard.maker_id}|${this.keyboard.keyboard_id}`)
        .set(this.keyboard)
        .then(() => {
          this.$message.success('New keyboard added successfully.')
        })
        .catch((e) => {
          this.$message.error('Error adding new keyboard:', e.message)
        })
    },
  },
}
</script>

<style lang="less">
.add-new-keyboard {
  .ant-calendar-picker,
  .ant-select {
    width: 100%;
  }
}
</style>
