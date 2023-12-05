import {useContext, useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {AllContext} from '../App';
import axios from '../config/axios';
import {ToastContainer, toast} from 'react-toastify';
export const BidModal = (prop) => {
  const {handleShow, show, artworkId, currentBid} = prop;
  const {artworksDispatch, usersDispatch} = useContext(AllContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [bid, setBid] = useState({amount: ''});
  const handleClose = () => {
    setErrors({});
    handleShow();
    setBid({amount: ''});
  };

  const newErrors = {};
  const handleBuyCredit = () => {
    navigate('/profile');
  };

  const runValidation = () => {
    if (bid.amount <= currentBid) {
      newErrors.bid = 'Please enter amount greater than current bid';
    }
    if (bid.amount == '') {
      newErrors.bid = 'Bid cannot be Empty';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleBid = async (e) => {
    e.preventDefault();
    // write bid logic here its still pending

    if (Object.keys(runValidation()).length === 0) {
      try {
        const bidResponse = await axios.post(
          `/og/auction/bid/${artworkId}`,
          bid,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        const updatedCredit = bidResponse.data.updatedUser.credit;
        setBid({amount: ''});
        toast.success('Bid sucessfull', {
          position: toast.POSITION.TOP_CENTER,
        });
        usersDispatch({
          type: 'SET_CREDIT',
          payload: updatedCredit,
        });
        const updatedBid =
          bidResponse.data.auction.artworks[0].currentBidAmount;
        artworksDispatch({
          type: 'SET_CURRENT_BID',
          payload: updatedBid,
        });

        artworksDispatch({
          type: 'UPDATE_EXIBITION_BID',
          payload: bidResponse.data.auction.artworks[0],
        });
        handleShow();
        setBid({amount: ''});
      } catch (error) {
        console.log(error.response.data);
        setErrors({bid: error.response.data.errors[0].msg});
      }
    }
  };
  return (
    <div>
      <ToastContainer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            {errors.bid &&
              (errors.bid ==
              'You do not have enough credit to bid, please buy more credit' ? (
                <p style={{color: 'red'}}>
                  You dont have enough credit to bid, please
                  <button
                    className="bg-transparent border border-0"
                    onClick={handleBuyCredit}
                  >
                    <b
                      style={{
                        color: 'red',
                        textDecoration: 'underline',
                      }}
                    >
                      buy more credit
                    </b>
                  </button>
                </p>
              ) : (
                <p
                  style={{
                    color: 'red',
                  }}
                >
                  {errors.bid}
                </p>
              ))}
          </span>
          <div className="d-flex align-items-center">
            <div className="mx-2">
              Current Bid:₹
              {currentBid}
            </div>
            <div className="mx-5 text-end">
              <input
                type="Number"
                name="amount"
                value={bid.amount}
                placeholder="Enter Bid"
                onChange={(e) => {
                  setBid({[e.target.name]: e.target.value});
                }}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="rounded-pill"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBid}
            className="rounded-pill"
          >
            Bid
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
