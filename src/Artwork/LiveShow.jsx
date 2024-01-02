import {jwtDecode} from 'jwt-decode';
import {useContext, useEffect, useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import io from 'socket.io-client';
import {AllContext} from '../App';
import {ExibitionList} from './ExibitionList';
import {loginCall} from '../App';
import axios from '../config/axios';
export const LiveShow = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const newSocket = io.connect(
        'https://onlinegallery-be.onrender.com',
        {
          extraHeaders: {
            'my-custom-header': localStorage.getItem('token'),
          },
        }
      );
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);
  const [reloadComponent, setReloadComponent] = useState(false);
  const {id} = useParams();
  const [bid, setBid] = useState({amount: ''});
  const [show, setShow] = useState(false);
  const {artworks, usersDispatch, artworksDispatch} =
    useContext(AllContext);
  const [artworkId, setArtworkId] = useState('');
  const userId = jwtDecode(localStorage.getItem('token')).id;

  const liveArtworks = artworks.data.filter(
    (auction) => auction.auction == id
  );
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const newErrors = {};
  const handleClose = () => {
    setErrors({});

    setShow((prev) => !prev);
  };
  const runValidation = () => {
    if (bid.amount <= artwork?.currentBidAmount) {
      newErrors.bid = 'Please enter amount greater than current bid';
    }
    if (bid.amount == '') {
      newErrors.bid = 'Bid cannot be Empty';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleShow = (artworkId, bid, auctionId) => {
    setArtworkId(artworkId);
    setShow((prev) => !prev);
  };

  const artwork = artworks.data.find((artwork) => {
    if (artwork._id == artworkId) {
      return artwork;
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const auctionResponse = await axios.get(
          `/og/auction/active?type=live`
        );
        artworksDispatch({
          type: 'SET_EXIBITION',
          payload: auctionResponse.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
    if (socket) {
      setReloadComponent((prev) => !prev);
      socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('join_auction', id);
      });

      socket.on('receive_bid', (bidResponse) => {
        handleClose();

        if (bidResponse.biddedUser._id == userId) {
          const updatedCredit = bidResponse.biddedUser.credit;
          usersDispatch({
            type: 'SET_CREDIT',
            payload: updatedCredit,
          });
        } else if (bidResponse.credictedUser._id == userId) {
          const updatedCredit = bidResponse.credictedUser.credit;
          usersDispatch({
            type: 'SET_CREDIT',
            payload: updatedCredit,
          });
        }
        const updatedBid = bidResponse.auction.artworks.find(
          (artwork) => artwork._id == bidResponse.artworkId
        ).currentBidAmount;

        const artworkName = bidResponse.auction.artworks.find(
          (artwork) => {
            return artwork._id == bidResponse.artworkId;
          }
        )?.title;

        toast.info(
          `${bidResponse.biddedUser.firstName} bidded ₹${updatedBid} on "${artworkName}"`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );

        artworksDispatch({
          type: 'SET_CURRENT_BID',
          payload: updatedBid,
        });
        const updateArtwork = bidResponse?.auction?.artworks.find(
          (artwork) => artwork._id == bidResponse.artworkId
        );
        artworksDispatch({
          type: 'UPDATE_EXIBITION_BID',
          payload: updateArtwork,
        });
      });
      socket.on('error', (data) => {
        console.log(data, 'error');
        setErrors({bid: data.msg});
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
      // check what this does ?
      return () => {
        socket.off('connect');
        socket.off('receive_bid');
        socket.off('disconnect');
      };
    }
  }, [socket, id]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (Object.keys(runValidation()).length === 0) {
      if (socket && bid.amount.trim() !== '') {
        await socket.emit('send_bid', {bid, id, artworkId, userId});

        loginCall(usersDispatch, artworksDispatch);
        setBid({amount: ''});
      }
    }
  };

  const handleBuyCredit = () => {
    navigate('/profile');
  };

  return (
    <div key={reloadComponent ? 'reload' : 'normal'}>
      <ToastContainer />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={{marginRight: '10px'}}>Flash sale</h2>
        <div
          className="spinner-grow spinner-grow-sm text-success"
          role="status"
          style={{animationDuration: '2s'}}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <ExibitionList
        artworks={liveArtworks}
        handleShow={handleShow}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bid for {artwork?.title}</Modal.Title>
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
              {artwork?.currentBidAmount}
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
            disabled={new Date(artwork?.end) < new Date()}
            className="rounded-pill"
          >
            Bid
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
