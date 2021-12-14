import { CHARACTERS_TYPES as TYPE } from '../types'

export const actionRequestCharacters = () => {
  return { type: TYPE.REQUEST_CHARACTERS }
}

export const actionOnRequestCharactersSuccess = (data) => {
  return { type: TYPE.REQUEST_CHARS_SUCCESS, payload: data }
}
