<template>
  <a-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
  >
    <a-card>
      <img slot="cover" :alt="keyboard.Name" :src="keyboard.Image" />
    </a-card>
    <a-divider orientation="left">General Information</a-divider>
    <a-descriptions :title="keyboard.Name" :column="1">
      <a-descriptions-item v-if="keyboard.Maker" label="Maker">
        {{ keyboard.Maker }}
      </a-descriptions-item>
      <a-descriptions-item v-if="keyboard.Status" label="Status">
        <a-badge :status="statusMap[keyboard.Status]" :text="keyboard.Status" />
      </a-descriptions-item>
      <a-descriptions-item v-if="keyboard.Release" label="GB Time">
        {{ keyboard.Release }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider orientation="left">Description</a-divider>
    {{ keyboard.Description }}
    <a-divider orientation="left">What's Included</a-divider>
    TBD
    <a-divider orientation="left">Colors</a-divider>
    TBD
    <a-divider orientation="left">More Information</a-divider>
    TBD
  </a-drawer>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'onClose', 'keyboard'],
  data() {
    return {
      statusMap: {
        Shipped: 'success',
        Closed: 'processing',
        Running: 'default',
      },
    }
  },
}
</script>
