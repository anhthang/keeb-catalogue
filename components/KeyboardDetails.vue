<template>
  <a-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
  >
    <a-card v-if="keyboard.Image">
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
      <a-descriptions-item v-if="keyboard.Start" label="GB Time">
        {{ keyboard.Start }} - {{ keyboard.End }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider v-if="keyboard.Description" orientation="left">
      Description
    </a-divider>
    {{ keyboard.Description }}
    <a-divider v-if="keyboard.Features" orientation="left">
      What's Included
    </a-divider>
    <vue-markdown :source="keyboard.Features" />
    <a-divider v-if="keyboard.Colors" orientation="left">Colors</a-divider>
    <vue-markdown :source="keyboard.Colors" />
    <a-divider v-if="keyboard.Others" orientation="left">
      More Information
    </a-divider>
    <vue-markdown :source="keyboard.Others" />
  </a-drawer>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'onClose', 'keyboard'],
  data() {
    return {
      statusMap: {
        Shipped: 'success',
        Closed: 'processing',
        Live: 'default',
      },
    }
  },
}
</script>
