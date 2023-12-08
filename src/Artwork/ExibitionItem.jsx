/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import {useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import {CountDown} from '../Auction/countDown';
export const ExibitionItem = (props) => {
  const address = useSelector((state) => {
    return state?.address?.myAddress;
  });
  const {artwork, handleShow} = props;
  const navigate = useNavigate();
  const location = useLocation();

  const handleBid = (id, str, auctionId) => {
    if (localStorage.getItem('token') && str == 'regular') {
      navigate(`/exibition/${id}`);
    }
    if (localStorage.getItem('token') && str == 'live') {
      navigate(`/liveShow/${auctionId}`);
    } else if (!localStorage.getItem('token')) {
      toast.error('Please Login before Bid', {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/bid');
    } else if (address.length == 0) {
      toast.error('Please add address before Bid', {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/profile');
    }
  };

  const liveBid = (artworkId, bid, auctionId) => {
    if (!localStorage.getItem('token')) {
      toast.error('Please Login before Bid', {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/bid');
    } else if (address.length == 0) {
      toast.error('Please add address before Bid', {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/profile');
    } else {
      handleShow(artworkId, bid, auctionId);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div
        className="card position-relative"
        style={{
          width: '350px',
          height: '450px',
        }}
      >
        <span
          className="position-absolute top-0 end-0 p-2"
          style={{
            zIndex: 1,
          }}
        >
          <CountDown
            auctionStart={artwork.start}
            auctionEnd={artwork.end}
            artworkId={artwork._id}
          />
        </span>

        <img
          src={artwork.images[0].url}
          className="card-img-top"
          alt="Fissure in Sandstone"
          style={{
            objectFit: 'cover',
            height: '230px',
          }}
        />
        <div className="card-body">
          <h5 className="card-title mb-3">{artwork.title}</h5>
          <p
            className="position-absolute top-0 start-0 rounded-pill p-1 px-2 m-2"
            style={{backgroundColor: '#FFDAB9'}}
          >
            {artwork.type == 'regular'
              ? 'Canvas Countdown'
              : 'Flash sale'}
          </p>
          <p>{artwork.description}</p>
          <div className="d-flex align-items-center justify-content-center">
            <p className="card-text mb-0 mr-2">
              <span className="border border-success border-3 rounded-pill p-2">
                Current Bid: ₹{artwork.currentBidAmount}
              </span>
            </p>

            {artwork.type === 'live' &&
            location.pathname !== '/exhibition/list' ? (
              <Button
                variant="primary"
                onClick={
                  handleShow
                    ? () => {
                        liveBid(
                          artwork._id,
                          artwork.currentBidAmount,
                          artwork.auction
                        );
                      }
                    : ''
                }
                disabled={new Date(artwork.end) < new Date()}
                className="rounded-pill"
              >
                Bid
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  handleBid(
                    artwork._id,
                    artwork.type,
                    artwork.auction
                  );
                }}
                disabled={new Date(artwork.end) < new Date()}
                className="rounded-pill"
              >
                Go Bid
              </Button>
            )}
          </div>

          {/* <p className="card-text">
            <span className="border border-success border-3 rounded-pill p-2">
              Current Bid: ₹{artwork.currentBidAmount}
            </span>
          </p>

          {artwork.type === 'live' &&
          location.pathname !== '/exibition/list' ? (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  liveBid(artwork._id, artwork.currentBidAmount);
                }}
                disabled={new Date(artwork.end) < new Date()}
                className="rounded-pill"
              >
                Bid
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  handleBid(
                    artwork._id,
                    artwork.type,
                    artwork.auction
                  );
                }}
                disabled={new Date(artwork.end) < new Date()}
                className="rounded-pill"
              >
                Go Bid
              </Button>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};
