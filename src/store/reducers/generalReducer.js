import { GENERAL_ACTIONS as GT } from '../types'

const initState = {
  failedRequests: {},
}

export const generalReducer = (state = initState, action) => {
  switch (action.type) {
    case GT.FAILED_TO_REQUEST:
      const { type, error } = action.payload
      const { status } = error.toJSON() //toJSON() otherwise can't access status prop
      return {
        ...state,
        failedRequests: {
          ...state.failedRequests,
          [`${type}${status}`]: action.payload,
        },
      }
    default:
      return state
  }
}
