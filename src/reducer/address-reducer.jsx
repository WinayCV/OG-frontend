const initialData = {myAddress: []};

export const addressReducer = (state = initialData, action) => {
  switch (action.type) {
    case 'SET_ADDRESS': {
      return {...state, myAddress: action.payload};
    }
    default: {
      return {...state};
    }
  }
};
