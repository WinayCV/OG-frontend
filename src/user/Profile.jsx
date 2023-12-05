import {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';
import {AllContext} from '../App';
import {
  startAddAddress,
  startGetAddress,
} from '../action/addressAction';
import axios from '../config/axios';
import {BuyCredit} from './buyCredit';

export const Profile = () => {
  const {users, usersDispatch} = useContext(AllContext);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [buy, setBuy] = useState(false);
  const [errors, setErrors] = useState({});
  const newErrors = {};
  const address = useSelector((state) => {
    return state?.address?.myAddress;
  });
  const [isEdit, setIsEdit] = useState(true);
  const [info, setInfo] = useState(
    isEdit ? address[address.length - 1]?.address : ''
  );

  const [firstName, setFirstName] = useState(users.data.firstName);
  const [mobileNum, setMobileNum] = useState(users.data.mobileNum);

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
    if (firstName == '') {
      newErrors.firstName = 'name cannot be empty';
    }
    if (mobileNum == '') {
      newErrors.mobileNum = 'Number cannot be empty';
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

      setErrors({});
    }
  };

  const handleEdit = async () => {
    setIsEdit((prev) => !prev);
    if (!isEdit && Object.keys(runValidation()).length === 0) {
      const formData = {
        firstName,
        mobileNum,
      };

      try {
        const profileResponse = await axios.put(
          '/og/editProfile',
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );

        usersDispatch({
          type: 'SET_USER',
          payload: profileResponse.data.user,
        });
        toast.success('Profile details saved sucessfull', {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Hi! {users?.data?.firstName}</h1>

      <div style={{width: '800px'}} className="mx-auto p-5">
        <Card>
          <Card.Header as="h5"> Profile Details</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="2">
                  Username
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={firstName}
                    name="firstName"
                    disabled={isEdit}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <span>
                    {errors.firstName && (
                      <p style={{color: 'red'}}>{errors.firstName}</p>
                    )}
                  </span>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="email"
                    value={users.data.email}
                    disabled={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Mobile
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    name="mobileNum"
                    value={mobileNum}
                    disabled={isEdit}
                    onChange={(e) => setMobileNum(e.target.value)}
                  />
                  <span>
                    {errors.mobileNum && (
                      <p style={{color: 'red'}}>{errors.mobileNum}</p>
                    )}
                  </span>
                </Col>
              </Form.Group>
              {address.length != 0 ? (
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Address
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="email"
                      value={address[address.length - 1]?.address}
                      disabled={true}
                      onChange={(e) => {
                        setInfo(e.target.value);
                      }}
                    />
                  </Col>
                </Form.Group>
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
            </Form>
          </Card.Body>
          <div className="mx-auto p-2">
            <Button
              variant="primary"
              onClick={handleEdit}
              className="rounded-pill"
            >
              {isEdit ? 'Edit' : 'Submit'}
            </Button>
            <Button onClick={handleToggle} className="rounded-pill">
              Buy credit
            </Button>
          </div>
          <BuyCredit buy={buy} handleToggle={handleToggle} />
        </Card>
      </div>
    </div>
  );
};
