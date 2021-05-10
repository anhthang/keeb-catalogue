import makers from '@/assets/makers.json'
import { sortBy, sample, keyBy } from 'lodash'
import slugify from 'slugify'

export const state = () => {
  return {
    makers,
    database: {},
    wishlistSettings: {
      caps_per_line: 3,
      wish: {
        title: 'Want',
      },
      trade: {
        title: 'Have',
      },
      social: {
        reddit: '',
        discord: '',
        qq: '',
      },
    },
  }
}

export const actions = {
  async fetchMaker({ commit }, name) {
    await fetch(
      `https://raw.githubusercontent.com/keycap-archivist/database/master/db/${name}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line prefer-const
        let { sculpts, ...rest } = data

        sculpts = sculpts.map((sculpt) => {
          const random = sample(sculpt.colorways)

          return {
            ...sculpt,
            slug: slugify(sculpt.name, { lower: true }),
            preview: random.img,
          }
        })

        const db = {
          maker: { ...rest, slug: name },
          sculpts: keyBy(sortBy(sculpts, 'name'), 'slug'),
        }

        commit('MAKER_DB', db)
      })
  },
}

export const mutations = {
  MAKER_DB(state, data) {
    state.database[data.maker.slug] = data
  },
  WISHLIST_SETTINGS(state, data) {
    state.wishlistSettings = data
  },
}
