export const artworksReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_DATA': {
      return {
        ...state,
        data: [],
        artwork: {},
        bid: [],
        myArtworks: [],
        myAuctions: [],
      };
    }
    case 'SET_MY_AUCTIONS': {
      return {...state, myAuctions: action.payload};
    }
    case 'UPDATE_EXIBITION_BID': {
      return {
        ...state,
        data: state.data.map((ele) => {
          if (ele._id == action.payload._id) {
            return {
              ...ele,
              currentBidAmount: action.payload.currentBidAmount,
            };
          } else {
            return {...ele};
          }
        }),
      };
    }
    case 'SET_ALL_ARTWORKS': {
      return {...state, myArtworks: action.payload};
    }
    case 'SET_CURRENT_BID': {
      return {...state, bid: action.payload};
    }
    case 'CLEAR_ONE_ARTWORK': {
      return {...state, artwork: {}};
    }
    case 'SET_ONE_ARTWORK': {
      return {...state, artwork: action.payload};
    }
    case 'SET_EXIBITION': {
      return {...state, data: action.payload};
    }
    default: {
      return {...state};
    }
  }
};
