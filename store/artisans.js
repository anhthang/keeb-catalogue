import { sortBy, sample, keyBy } from 'lodash'
import slugify from 'slugify'
import { FAVORITE_MAKERS } from '@/constants'
import makers from '@/assets/makers.json'

export const state = () => {
  return {
    makers,
    database: {},
    favoriteMakers: JSON.parse(localStorage.getItem(FAVORITE_MAKERS)) || [],
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
  updateFavoriteMakers({ commit, state }, name) {
    let favoriteMakers = [...state.favoriteMakers]
    if (!favoriteMakers.includes(name)) {
      favoriteMakers.push(name)
    } else {
      favoriteMakers = favoriteMakers.filter((i) => i !== name)
    }

    localStorage.setItem(FAVORITE_MAKERS, JSON.stringify(favoriteMakers))
    commit('FAVORITE_MAKERS', favoriteMakers)
  },
}

export const mutations = {
  MAKER_DB(state, data) {
    state.database[data.maker.slug] = data
  },
  WISHLIST_SETTINGS(state, data) {
    state.wishlistSettings = data
  },
  FAVORITE_MAKERS(state, data) {
    state.favoriteMakers = data
  },
}
