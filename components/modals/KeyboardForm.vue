<template>
  <div class="add-new-keyboard">
    <a-row :gutter="8">
      <a-col :xs="24" :md="12">
        <a-form-item label="Name">
          <a-input v-model="keyboard.name" :disabled="isEdit">
            <a-icon slot="prefix" type="font-size" />
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="Price">
          <a-input-group class="price-input-group" compact>
            <a-select v-model="keyboard.currency" style="width: 30%">
              <a-select-option
                v-for="currency in currencies"
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </a-select-option>
            </a-select>
            <a-input-number
              v-model="keyboard.price"
              :parser="(v) => v.replace(/\$\s?|(,*)/g, '')"
              style="width: 70%"
            />
          </a-input-group>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :xs="24" :md="12">
        <a-form-item label="Maker Id">
          <a-input v-model="keyboard.maker_id" disabled>
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="Keyboard Id">
          <a-input v-model="keyboard.keyboard_id" disabled>
            <a-icon slot="prefix" :component="KeyboardSvg" />
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :xs="24" :md="12">
        <a-form-item label="Layout">
          <a-select v-model="keyboard.layout">
            <a-select-option
              v-for="layout in Object.values(layoutMap)"
              :key="layout"
              :value="layout"
            >
              {{ layout }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
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
      </a-col>
    </a-row>

    <a-form-item label="Description">
      <a-textarea
        v-model="keyboard.description"
        :auto-size="{ minRows: 1, maxRows: 5 }"
      />
    </a-form-item>

    <a-form-item label="GB Time">
      <a-row :gutter="8">
        <a-col :xs="24" :md="12">
          <a-date-picker
            v-model="startValue"
            :disabled-date="disabledStartDate"
            :format="dateFormat"
            placeholder="Start"
            @openChange="handleStartOpenChange"
          />
        </a-col>
        <a-col :xs="24" :md="12">
          <a-date-picker
            v-model="endValue"
            :disabled-date="disabledEndDate"
            :format="dateFormat"
            placeholder="End"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
        </a-col>
      </a-row>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isEmpty } from 'lodash'
import slugify from 'slugify'
import KeyboardSvg from '../icons/KeyboardSvg'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['makerId', 'metadata', 'isEdit'],
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
        price: null,
        currency: 'USD',
      },
      dateFormat: 'DD/MM/YYYY',
      startValue: null,
      endValue: null,
      endOpen: false,
      statuses: ['Live', 'Interest Check', 'Shipped', 'Closed'],
      currencies: ['USD', 'EUR', 'SGD', 'MYR', 'CNY'],
      KeyboardSvg,
    }
  },
  computed: {
    ...mapState('keebs', ['layoutMap']),
  },
  watch: {
    'keyboard.name'(val) {
      this.keyboard.keyboard_id = slugify(val, { lower: true })
    },
    startValue(val) {
      this.keyboard.start = val ? val.format(this.dateFormat) : null
    },
    endValue(val) {
      this.keyboard.end = val ? val.format(this.dateFormat) : null
    },
  },
  created() {
    if (!isEmpty(this.metadata)) {
      this.keyboard = { ...this.metadata }
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    addKeyboard() {
      this.$fire.firestore
        .collection('keyboards')
        .doc(`${this.keyboard.maker_id}|${this.keyboard.keyboard_id}`)
        .set(this.keyboard)
        .then(() => {
          const msg = this.isEdit
            ? 'Updated successfully.'
            : 'Added successfully'

          this.$message.success(msg)
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
  .ant-input-number,
  .ant-select {
    width: 100%;
  }
}

.price-input-group {
  padding: 4px 0;
}
</style>
