import { HOMEWORLDS_TYPE as TYPE } from '../types'
import { normalizeArrayOfObjects } from '../../services/dataParser.js'

const initState = {
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
    case TYPE.REQUEST_MULTI_WORLDS_SUCCESS: {
      return {
        ...state,
        homeworlds: {
          ...state.homeworlds,
          ...normalizeArrayOfObjects(action.payload, 'url'),
        },
      }
    }
    default:
      return state
  }
}
