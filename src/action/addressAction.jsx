import axios from '../config/axios';

export const startGetAddress = () => {
  return async (dispatch) => {
    try {
      console.log('object');
      const addressResponse = await axios.get('/og/address/list', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      console.log(addressResponse);
      dispatch(setMyAddress(addressResponse.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const startAddAddress = (address, addressToast) => {
  return async (dispatch) => {
    try {
      console.log(address);
      const addressResponse = await axios.post(
        'og/address',
        address,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      dispatch(setMyAddress(addressResponse.data));
      addressToast();
    } catch (error) {
      console.log(error);
    }
  };
};

const setMyAddress = (address) => {
  return {type: 'SET_ADDRESS', payload: address};
};
