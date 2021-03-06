<template>
  <a-card>
    <a-list
      item-layout="vertical"
      :data-source="keyboards"
      :pagination="keyboards.length > pageSize ? { pageSize } : false"
      :loading="loading"
    >
      <a-list-item slot="renderItem" key="item.name" slot-scope="item">
        <a slot="actions" :href="item.url" target="_blank">
          <a-button
            key="website"
            :disabled="!item.url"
            size="small"
            type="link"
            icon="global"
          >
            Website
          </a-button>
        </a>
        <a slot="actions" :href="item.geekhack" target="_blank">
          <a-button
            key="geekhack"
            :disabled="!item.geekhack"
            size="small"
            type="link"
            icon="message"
          >
            Discuss
          </a-button>
        </a>

        <a-popover slot="actions" title="Selected Keebs">
          <compare-keeb-popover slot="content" />

          <a-button
            size="small"
            type="link"
            icon="diff"
            @click="addToCompare(item)"
          >
            Compare
          </a-button>
        </a-popover>

        <a-button
          v-if="user.isEditor"
          slot="actions"
          size="small"
          type="link"
          icon="edit"
          @click="showEditKeyboard(item)"
        >
          Edit
        </a-button>

        <img
          v-if="item.img"
          slot="extra"
          width="300"
          :alt="item.name"
          :src="item.img"
        />
        <a-empty
          v-else
          slot="extra"
          class="keyboard-no-img"
          description="No Image"
        />
        <!-- <a-list-item-meta :title="item.name" @click="showDrawer(item)"> -->
        <a-list-item-meta :title="item.name">
          <a-avatar
            slot="avatar"
            :src="makers[item.maker_id] && makers[item.maker_id].img"
          />
          <nuxt-link slot="description" :to="`/keebs/maker/${item.maker_id}`">
            {{ makerName(item.maker_id) }}
          </nuxt-link>
          <a-badge :status="badgeStatus[item.status]" :text="item.status" />
        </a-list-item-meta>
        <a-descriptions size="small">
          <a-descriptions-item label="Price">
            {{ keebPrice(item) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="item.layout" label="Layout">
            <nuxt-link :to="`/keebs/layout/${layoutSlug(item.layout)}`">
              {{ item.layout }}
            </nuxt-link>
          </a-descriptions-item>
          <a-descriptions-item v-if="item.start && item.end" label="GB Time">
            {{ item.start }} - {{ item.end }}
          </a-descriptions-item>
          <a-descriptions-item v-else-if="item.start" label="GB Date">
            {{ item.start }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions>
          <a-descriptions-item>
            {{ item.description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-list-item>
    </a-list>

    <keyboard-details
      :visible="visible"
      :on-close="closeDrawer"
      :keyboard="currentKeyboard"
    />

    <a-modal
      v-model="showEditKeyboardModal"
      title="Edit Keeb"
      destroy-on-close
      @ok="updateKeeb"
    >
      <keyboard-form
        ref="keyboardModal"
        :metadata="currentKeyboard"
        :maker-id="currentKeyboard.maker_id"
        :is-edit="true"
      />
    </a-modal>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import slugify from 'slugify'
import KeyboardForm from './modals/KeyboardForm.vue'

export default {
  components: { KeyboardForm },
  props: {
    loading: Boolean,
  },
  data() {
    return {
      currentKeyboard: {},
      visible: false,
      showEditKeyboardModal: false,
      confirmLoading: false,
      pageSize: 5,
    }
  },
  computed: {
    ...mapState('keebs', ['badgeStatus', 'keyboards', 'makers']),
    ...mapState(['user']),
    makerName() {
      return (makerId) => this.makers[makerId]?.name
    },
    layoutSlug() {
      return (layout) => slugify(layout, { lower: true })
    },
    keebPrice() {
      return (kb) => (kb.price ? `${kb.currency} ${kb.price}` : 'TBD')
    },
  },
  methods: {
    showDrawer(item) {
      this.visible = true
      this.currentKeyboard = item
    },
    closeDrawer() {
      this.visible = false
      this.currentKeyboard = {}
    },
    showEditKeyboard(keyboard) {
      this.currentKeyboard = keyboard
      this.showEditKeyboardModal = !this.showEditKeyboardModal
    },
    async updateKeeb() {
      this.confirmLoading = true

      await this.$refs.keyboardModal.addKeyboard()

      this.confirmLoading = false
      this.showEditKeyboardModal = false
    },
    addToCompare(keeb) {
      this.$store.dispatch('keebs/addToCompare', keeb)
    },
  },
}
</script>

<style lang="less">
.container {
  .ant-list-item-extra {
    display: flex;
    align-items: center;

    @media (max-width: 992px) {
      img {
        max-width: 30vw;
      }
    }

    @media (max-width: 576px) {
      img {
        max-width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    .ant-list-item-action {
      button > span {
        display: none;
      }
    }
  }
}
.keyboard-no-img {
  width: 300px;
}
</style>
