<template>
  <a-select
    mode="multiple"
    label-in-value
    :value="value"
    placeholder="Search"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    @search="fetchKeycaps"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-opt-group v-for="maker in filteredCaps" :key="maker[0]">
      <a-select-option v-for="cap in maker[1]" :key="cap.id">
        {{ `${cap.sculpt_name} / ${cap.name}` }}
      </a-select-option>
    </a-select-opt-group>
  </a-select>
</template>

<script>
import { mapMutations } from 'vuex'
import { debounce, groupBy } from 'lodash'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['selected', 'visible'],
  data() {
    this.lastFetchId = 0
    this.fetchKeycaps = debounce(this.fetchKeycaps, 800)
    return {
      data: [],
      value: [],
      fetching: false,
    }
  },
  computed: {
    filteredCaps() {
      const caps = this.data.filter((c) => !this.selected.includes(c.id))

      return Object.entries(groupBy(caps, 'maker_name'))
    },
  },
  watch: {
    visible() {
      if (this.visible === false) {
        this.value = []
      }
    },
  },
  methods: {
    ...mapMutations('artisans', ['ADD_TO_COLLECTION']),
    fetchKeycaps(value) {
      if (!value) return
      this.lastFetchId += 1
      const fetchId = this.lastFetchId

      this.data = []
      this.fetching = true
      fetch(`http://localhost:4000/keycaps?name_like=${value}&_limit=100`)
        .then((response) => response.json())
        .then((body) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }

          this.data = body
          this.fetching = false
        })
    },
    handleChange(value) {
      this.ADD_TO_COLLECTION(value)
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      })
    },
  },
}
</script>
