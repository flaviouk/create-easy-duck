export interface Types {
  START: string
  RESET: string
  FINISH: string
  ERROR: string
}

export interface Action {
  type: string
}

export interface ReducerState {
  status: {
    isLoading: boolean
    isLoaded: boolean
  }
  error: null
  payload: null
}
