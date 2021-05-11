<template>
  <a-select
    mode="multiple"
    label-in-value
    :value="value"
    placeholder="input search text"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    @search="fetchKeycaps"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-opt-group v-for="maker in data" :key="maker[0]">
      <a-select-option v-for="cap in maker[1]" :key="cap.id">
        {{ `${cap.sculpt_name} / ${cap.name}` }}
      </a-select-option>
    </a-select-opt-group>
  </a-select>
</template>

<script>
import { debounce, groupBy } from 'lodash'

export default {
  data() {
    this.lastFetchId = 0
    this.fetchKeycaps = debounce(this.fetchKeycaps, 800)
    return {
      data: [],
      value: [],
      fetching: false,
    }
  },
  methods: {
    fetchKeycaps(value) {
      if (!value) return
      this.lastFetchId += 1
      const fetchId = this.lastFetchId

      this.data = []
      this.fetching = true
      fetch(`http://localhost:4000/keycaps?name_like=${value}`)
        .then((response) => response.json())
        .then((body) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }

          this.data = Object.entries(groupBy(body, 'maker_name'))
          this.fetching = false
        })
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      })
    },
  },
}
</script>
