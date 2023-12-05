export const userReducer = (state, action) => {
  switch (action.type) {
    case 'RES_ORDER': {
      return {...state, resOrder: action.payload};
    }
    case 'ALL_ARTWORKS': {
      return {...state, allArtworks: action.payload};
    }
    case 'SET_LIVE_AUCTION': {
      return {...state, live: action.payload};
    }
    case 'CLEAR_DATA': {
      return {...state, data: {}};
    }
    case 'SET_CREDIT': {
      return {
        ...state,
        data: {...state.data, credit: action.payload},
      };
    }
    case 'SET_USER': {
      return {...state, data: action.payload};
    }
    default: {
      return {...state};
    }
  }
};
