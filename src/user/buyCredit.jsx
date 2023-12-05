import {isEmpty} from 'lodash';
import {useContext, useEffect, useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import {AllContext} from '../App';
import axios from '../config/axios';

export const BuyCredit = (props) => {
  const {buy, handleToggle} = props;
  const {usersDispatch} = useContext(AllContext);
  const {users} = useContext(AllContext);
  const [show, setShow] = useState(buy);
  const [form, setForm] = useState({amount: ''});
  const [errors, setErrors] = useState({});
  const newErrors = {};
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  // buying credits
  useEffect(() => {
    (async () => {
      if (status == 'success' && localStorage.getItem('transId')) {
        const transId = localStorage.getItem('transId');
        try {
          const statusResponse = await axios.put(
            `/og/payment/${transId}`,
            {},
            {
              headers: {
                authorization: localStorage.getItem('token'),
              },
            }
          );
          localStorage.removeItem('transId');
          toast.success(`${statusResponse.data.msg}`, {
            position: toast.POSITION.TOP_CENTER,
          });
          usersDispatch({
            type: 'SET_CREDIT',
            payload: statusResponse.data.credit,
          });
        } catch (error) {
          console.log(error);
        }
      } else if (
        status == 'failed' &&
        localStorage.getItem('transId')
      ) {
        // deleting unsuccessfull payment
        const transId = localStorage.getItem('transId');
        toast.error('Payment Failed', {
          position: toast.POSITION.TOP_CENTER,
        });
        const statusResponse = await axios.delete(
          `/og/payment/${transId}`,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        localStorage.removeItem('transId');
        console.log(statusResponse);
      }
    })();
  }, []);
  const handleClose = () => {
    handleToggle();
  };
  // const handleShow = () => {
  //   setShow(true);
  // };
  const runValidation = () => {
    if (form.amount == '' || form.amount == 0) {
      newErrors.error = 'Enter valid amount';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleBuy = async (e) => {
    e.preventDefault();
    runValidation();
    if (isEmpty(newErrors)) {
      console.log(form);
      const paymentResponse = await axios.post('/og/payment', form, {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      });
      localStorage.setItem('transId', paymentResponse.data.id);

      window.location = paymentResponse.data.url;
      console.log(paymentResponse);
    }
  };
  return (
    <div>
      <ToastContainer />
      <Modal show={buy} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Buy more Credit!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            {errors.error && (
              <p style={{color: 'red'}}>{errors.error}</p>
            )}
          </span>
          <div className="d-flex align-items-center">
            <div className="mx-2">My credit:₹{users.data.credit}</div>
            <div className="mx-5 text-end">
              <input
                type="Number"
                name="amount"
                value={form.amount}
                placeholder="Enter Amount"
                onChange={(e) => {
                  setForm({[e.target.name]: e.target.value});
                }}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBuy}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
