/* eslint-disable no-console */
import { groupBy, keyBy } from 'lodash'
import slugify from 'slugify'
const keyboardStatus = {
  ic: ['Interest Check'],
  live: ['Running', 'Live'],
  closed: ['Closed', 'Shipped'],
}

export const state = () => {
  return {
    badgeStatus: {
      Shipped: 'success',
      Live: 'processing',
      Closed: 'default',
    },
    keyboards: [],
    makers: {},
  }
}

export const actions = {
  getMakers({ commit }) {
    this.$fire.firestore
      .collection('keyboard-makers')
      .get()
      .then((doc) => {
        const makers = []
        doc.docs.forEach((d) => {
          makers.push(d.data())
        })

        commit('SET_MAKERS', makers)
      })
  },
  async getKeyboardsByMaker({ commit }, makerId) {
    console.log('getting keyboards from', makerId)

    const maker = await this.$fire.firestore
      .collection('keyboard-makers')
      .doc(makerId)
      .get()
      .then((d) => d.data())

    commit('SET_MAKERS', [maker])

    await this.$fire.firestore
      .collection('keyboards')
      .where('maker_id', '==', makerId)
      .get()
      .then((doc) => {
        const keyboards = []
        doc.docs.forEach((d) => {
          keyboards.push(d.data())
        })

        commit('SET_KEYBOARDS', keyboards)
      })
      .catch((e) => {
        console.error(e.message)
        commit('SET_KEYBOARDS', [])
      })
  },
  async getKeyboardsByStatus({ commit }, status = 'live') {
    console.log('getting keyboards', status)

    let makerIds = []

    await this.$fire.firestore
      .collection('keyboards')
      .where('status', 'in', keyboardStatus[status])
      .get()
      .then((doc) => {
        const keyboards = []
        doc.docs.forEach((d) => {
          keyboards.push(d.data())
        })

        commit('SET_KEYBOARDS', keyboards)

        makerIds = Object.keys(groupBy(keyboards, 'maker_id'))
      })
      .catch((e) => {
        console.error(e.message)
        commit('SET_KEYBOARDS', [])
      })

    await this.$fire.firestore
      .collection('keyboard-makers')
      .where(this.$fireModule.firestore.FieldPath.documentId(), 'in', makerIds)
      .get()
      .then((doc) => {
        const makers = []
        doc.docs.forEach((d) => {
          makers.push(d.data())
        })

        commit('SET_MAKERS', makers)
      })
  },
}

export const mutations = {
  SET_KEYBOARDS(state, keyboards) {
    state.keyboards = keyboards
  },
  SET_MAKERS(state, makers) {
    state.makers = keyBy(makers, (m) => slugify(m.name, { lower: true }))
  },
}
