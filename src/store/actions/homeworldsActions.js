import { HOMEWORLDS_TYPE as TYPE } from '../types'

//not in use
export const actionRequestAHomeworld = (worldId) => {
  return { type: TYPE.REQUEST_HOMEWORLD, payload: worldId }
}

//not in use
export const actionOnRequestAHomeworldSuccess = (worldId, world) => {
  return {
    type: TYPE.REQUEST_HOMEWORLD_SUCCESS,
    payload: { worldId, world },
  }
}

export const actionRequestMultipleWorlds = (charsWithWorldIds) => {
  return { type: TYPE.REQUEST_MULTI_HOMEWORLDS, payload: charsWithWorldIds }
}

export const actionOnRequestMultipleWorldsSuccess = (worlds) => {
  return { type: TYPE.REQUEST_MULTI_WORLDS_SUCCESS, payload: worlds }
}
