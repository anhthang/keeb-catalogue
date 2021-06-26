/* eslint-disable no-console */
import { invert } from 'lodash'

export const state = () => {
  return {
    statusMap: {
      Shipped: 'success',
      Live: 'processing',
      Closed: 'default',
    },
    keyboards: [],
    maker: {},
  }
}

export const actions = {
  async getKeyboardsByMaker({ commit }, makerId) {
    console.log('getting keyboards from', makerId)

    const maker = await this.$fire.firestore
      .collection('keyboards')
      .doc(makerId)
      .get()
      .then((d) => d.data())

    commit('SET_MAKER', maker)

    this.$fire.firestore
      .collection(`keyboards/${makerId}/keyboards`)
      .get()
      .then((doc) => {
        const keyboards = []
        doc.docs.forEach((d) => {
          keyboards.push({ ...d.data(), maker })
        })

        commit('SET_KEYBOARDS', keyboards)
      })
      .catch((e) => {
        console.error(e.message)
        commit('SET_KEYBOARDS', [])
      })
  },
  getKeyboardsByStatus({ commit, state }, status = 'live') {
    this.$fire.firestore
      .collectionGroup('keyboards')
      .where('status', '==', invert(state.statusMap)[status])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data())
        })
      })
      .catch((e) => {
        console.error(e.message)
        commit('SET_KEYBOARDS', [])
      })
  },
}

export const mutations = {
  SET_KEYBOARDS(state, keyboards) {
    state.keyboards = keyboards
  },
  SET_MAKER(state, maker) {
    state.maker = maker
  },
}
