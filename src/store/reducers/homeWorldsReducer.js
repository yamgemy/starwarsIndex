import { HOMEWORLDS_TYPE as TYPE } from '../types'

const initState = {
  mock: {
    23: {
      name: 'planet1',
    },
    25: {
      name: 'planet1',
    },
  },
  homeworlds: {},
}

export const homeWorldsReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPE.REQUEST_HOMEWORLD_SUCCESS: {
      return {
        ...state,
        homeworlds: { ...state.homeworlds, ...action.payload },
      }
    }
    default:
      return state
  }
}
