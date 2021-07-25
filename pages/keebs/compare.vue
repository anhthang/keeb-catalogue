<template>
  <div class="container">
    <a-page-header title="Keeb Comparison" @back="() => $router.go(-1)">
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
  computed: {
    ...mapState('keebs', ['compareKeebs']),
    columns() {
      const cols = [{ title: '', key: 'display', dataIndex: 'display' }]
      const width = this.compareKeebs.length === 2 ? '45%' : '30%'

      this.compareKeebs.forEach((keyboard) => {
        cols.push({
          title: keyboard.name,
          key: keyboard.keyboard_id,
          dataIndex: keyboard.keyboard_id,
          width,
        })
      })

      return cols
    },
    dataSource() {
      const data = [
        { key: 'price', display: 'Price' },
        { key: 'status', display: 'Status' },
        { key: 'description', display: 'Description' },
        { key: 'layout', display: 'Layout' },
        { key: 'start', display: 'Start' },
        { key: 'end', display: 'End' },
      ]

      return data.map((row) => {
        this.compareKeebs.forEach((keyboard) => {
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
