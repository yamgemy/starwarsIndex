import { GENERAL_ACTIONS as GTYPE } from '../types'

export const onRequestFailed = (actionCalled, error) => {
  return {
    type: GTYPE.FAILED_TO_REQUEST,
    payload: { ...actionCalled, error },
  }
}
