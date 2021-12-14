import { GENERAL_ACTIONS as GT } from '../types'

const initState = {
  failedRequests: [],
}

export const generalReducer = (state = initState, action) => {
  switch (action.type) {
    case GT.FAILED_TO_REQUEST:
      return {
        ...state,
        failedRequests: [...state.failedRequests, action.payload],
      }
    default:
      return state
  }
}
