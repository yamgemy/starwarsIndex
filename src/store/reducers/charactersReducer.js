import { CHARACTERS_TYPES as TYPE } from '../types'
import { normalizeArrayOfObjects } from '../../services/dataParser.js'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'charactersReducer')

const initState = {
  pages: 0,
  characters: {},
}

export const charactersReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPE.REQUEST_CHARS_SUCCESS: {
      return {
        ...state,
        characters: {
          ...state.characters,
          ...normalizeArrayOfObjects(action.payload, 'url'),
        },
        pages: state.pages + 1,
      }
    }
    default:
      return state
  }
}
