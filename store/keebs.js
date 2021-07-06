/* eslint-disable no-console */
import { groupBy, keyBy, chunk } from 'lodash'
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
      'Interest Check': 'default',
    },
    layoutMap: {
      '40percent': '40%',
      '60percent': '60%',
      '65percent': '65%',
      '75percent': '75%',
      1800: '1800',
      alice: 'Alice',
      hhkb: 'HHKB',
      numpad: 'Numpad',
      tkl: 'TKL',
      fullsize: 'Full-size',
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
  async getKeyboardsByMaker({ commit, state }, makerId) {
    console.log('getting keyboards from', makerId)

    if (!state.makers[makerId]) {
      const maker = await this.$fire.firestore
        .collection('keyboard-makers')
        .doc(makerId)
        .get()
        .then((d) => d.data())

      commit('SET_MAKERS', [maker])
    }

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
  async getKeyboardsByStatus({ commit, state }, status = 'live') {
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

    makerIds = makerIds.filter((id) => !state.makers[id])

    const chunks = chunk(makerIds, 10)
    chunks.forEach(async (ids) => {
      await this.$fire.firestore
        .collection('keyboard-makers')
        .where(this.$fireModule.firestore.FieldPath.documentId(), 'in', ids)
        .get()
        .then((doc) => {
          const makers = []
          doc.docs.forEach((d) => {
            makers.push(d.data())
          })

          commit('SET_MAKERS', makers)
        })
    })
  },
  async getKeyboardsByLayout({ commit, state }, layout) {
    console.log('getting keyboards by layout', layout)

    let makerIds = []

    await this.$fire.firestore
      .collection('keyboards')
      .where('layout', '==', state.layoutMap[layout])
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

    makerIds = makerIds.filter((id) => !state.makers[id])

    const chunks = chunk(makerIds, 10)
    chunks.forEach(async (ids) => {
      await this.$fire.firestore
        .collection('keyboard-makers')
        .where(this.$fireModule.firestore.FieldPath.documentId(), 'in', ids)
        .get()
        .then((doc) => {
          const makers = []
          doc.docs.forEach((d) => {
            makers.push(d.data())
          })

          commit('SET_MAKERS', makers)
        })
    })
  },
}

export const mutations = {
  SET_KEYBOARDS(state, keyboards) {
    state.keyboards = keyboards
  },
  SET_MAKERS(state, makers) {
    state.makers = {
      ...state.makers,
      ...keyBy(makers, (m) => slugify(m.name, { lower: true })),
    }
  },
}
