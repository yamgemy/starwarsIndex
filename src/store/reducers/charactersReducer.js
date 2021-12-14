import { CHARACTERS_TYPES as TYPE } from '../types'

const initState = {
  pages: 0,
  characters: {},
}

export const charactersReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPE.REQUEST_CHARS_SUCCESS: {
      return {
        ...state,
        characters: { ...state.characters, ...action.payload },
        pages: state.pages + 1,
      }
    }
    default:
      return state
  }
}
