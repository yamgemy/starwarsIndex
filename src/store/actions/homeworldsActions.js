import { HOMEWORLDS_TYPE as TYPE } from '../types'

export const actionRequestAHomeworld = (worldId) => {
  return { type: TYPE.REQUEST_HOMEWORLD, payload: worldId }
}

export const actionOnRequestAHomeworldSuccess = (worldId, world) => {
  return {
    type: TYPE.REQUEST_HOMEWORLD_SUCCESS,
    payload: { worldId, world },
  }
}
