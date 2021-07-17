<template>
  <div class="container">
    <a-page-header title="Keeb Comparison">
      <div class="add-to-compare">
        <a-alert
          class="collection-alert"
          message="Keeb comparison still in development. If you encouter any issue, please let us know."
          banner
        />
        <a-button>Add to Compare</a-button>
      </div>
      <a-table
        bordered
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
      />
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  fetch() {
    this.$store.dispatch('keebs/getKeyboardsByMaker', 'gok-design')
  },
  computed: {
    ...mapState('keebs', ['keyboards']),
    columns() {
      const cols = [{ title: 'Name', key: 'display', dataIndex: 'display' }]

      this.keyboards.forEach((keyboard) => {
        cols.push({
          title: keyboard.name,
          key: keyboard.keyboard_id,
          dataIndex: keyboard.keyboard_id,
          width: '45%',
        })
      })

      return cols
    },
    dataSource() {
      const data = [
        // { key: 'name', display: 'Name' },
        { key: 'price', display: 'Price' },
        { key: 'status', display: 'Status' },
        { key: 'description', display: 'Description' },
        { key: 'layout', display: 'Layout' },
        { key: 'start', display: 'Start' },
        { key: 'end', display: 'End' },
      ]

      return data.map((row) => {
        this.keyboards.forEach((keyboard) => {
          row[keyboard.keyboard_id] = keyboard[row.key]
        })

        return row
      })
    },
  },
}
</script>

<style lang="less">
.add-to-compare {
  margin-bottom: 16px;
}
</style>
