import { HOMEWORLDS_TYPE as TYPE } from '../types'
import { getIdFromUrl } from '../../services/dataParser.js'

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
      const { worldId, world } = action.payload
      return {
        ...state,
        homeworlds: { ...state.homeworlds, [worldId]: world },
      }
    }
    default:
      return state
  }
}
