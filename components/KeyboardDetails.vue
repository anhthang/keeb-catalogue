<template>
  <a-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
  >
    <a-card v-if="keyboard.img">
      <img slot="cover" :alt="keyboard.name" :src="keyboard.img" />
    </a-card>

    <a-divider orientation="left">General Information</a-divider>
    <a-descriptions :title="keyboard.name" :column="1">
      <a-descriptions-item v-if="keyboard.maker" label="Maker">
        {{ keyboard.maker.name }}
      </a-descriptions-item>
      <a-descriptions-item v-if="keyboard.status" label="Status">
        <a-badge
          :status="badgeStatus[keyboard.status]"
          :text="keyboard.status"
        />
      </a-descriptions-item>
      <a-descriptions-item v-if="keyboard.start" label="GB Time">
        {{ keyboard.start }} - {{ keyboard.end }}
      </a-descriptions-item>
    </a-descriptions>

    <a-divider v-if="keyboard.description" orientation="left">
      Description
    </a-divider>
    {{ keyboard.description }}

    <a-divider v-if="keyboard.features" orientation="left">Features</a-divider>
    <vue-markdown :source="keyboard.features" />

    <a-divider v-if="keyboard.included" orientation="left">
      What's Included
    </a-divider>
    <vue-markdown :source="keyboard.included" />

    <a-divider v-if="keyboard.colors" orientation="left">Colors</a-divider>
    <vue-markdown :source="keyboard.colors" />

    <a-divider v-if="keyboard.others" orientation="left">
      More Information
    </a-divider>
    <vue-markdown :source="keyboard.others" />
  </a-drawer>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapState } from 'vuex'

export default {
  components: {
    VueMarkdown,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible', 'onClose', 'keyboard'],
  computed: {
    ...mapState('keebs', ['badgeStatus']),
  },
}
</script>
