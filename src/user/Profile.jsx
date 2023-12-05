import {useContext, useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {AllContext} from '../App';
import {BuyCredit} from './buyCredit';
import {useSelector, useDispatch} from 'react-redux';
import {
  startAddAddress,
  startGetAddress,
} from '../action/addressAction';
import {ToastContainer, toast} from 'react-toastify';
import axios from '../config/axios';

export const Profile = () => {
  const {users, usersDispatch} = useContext(AllContext);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState('');
  const [buy, setBuy] = useState(false);
  const [errors, setErrors] = useState({});
  const newErrors = {};
  const address = useSelector((state) => {
    return state?.address?.myAddress;
  });
  console.log(address);
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        dispatch(startGetAddress());
        try {
          const response = await axios.get('/og/getProfile', {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          });
          usersDispatch({
            type: 'SET_USER',
            payload: response.data.user,
          });
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, []);

  const handleToggle = () => {
    setBuy((prev) => !prev);
  };
  const runValidation = () => {
    if (info == '') {
      newErrors.address = 'Address cannot be empty';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const addressToast = () => {
    toast.success('Address saved sucessfull', {
      position: toast.POSITION.TOP_CENTER,
    });
    setInfo('');
  };
  const handleAddAddress = () => {
    if (Object.keys(runValidation()).length === 0) {
      dispatch(startAddAddress({address: info}, addressToast));
      setEdit(!edit);
      setErrors({});
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Hi! {users.data.firstName}</h1>
      <h3>Mail:{users.data.email}</h3>
      <h3>Mobile:{users.data.mobileNum}</h3>
      <h3>
        Address:
        {address.length != 0 ? (
          address[0]?.address
        ) : (
          <>
            <div className="input-group flex-nowrap">
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="Address"
                aria-describedby="addon-wrapping"
                name="info"
                value={info}
                onChange={(e) => {
                  setInfo(e.target.value);
                }}
              />
              <span>
                {errors.address && (
                  <p style={{color: 'red'}}>{errors.address}</p>
                )}
              </span>
            </div>
            <b>Add address to get started</b>
            <Button
              onClick={handleAddAddress}
              className="rounded-pill"
            >
              Add address
            </Button>
          </>
        )}
      </h3>
      <BuyCredit buy={buy} handleToggle={handleToggle} />
      <Button onClick={handleToggle} className="rounded-pill">
        Buy credit
      </Button>
    </div>
  );
};
