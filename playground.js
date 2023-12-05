// const options = artworks?.myArtworks
//   .filter((artwork) => {
//     if (isEmpty(artwork?.auction)) {
//       return artwork;
//     }
//   })
//   .map((ele) => {
//     return {value: ele._id, label: ele.title};
//   });

// const handleArtworksChange = (selectedArtworks) => {
//   // Handle selected artworks here
//   const selectedValues = selectedArtworks.map(
//     (option) => option.value
//   );
//   setForm({
//     ...form,
//     artworks: selectedValues,
//   });
// };
{
  /* <CreatableSelect
            isMulti
            // Update the options prop with the actual options for artworks
            options={options}
            value={form.artworks.map((id) => ({
              value: id,
              label:
                artworks?.myArtworks.find(
                  (artwork) => artwork._id === id
                )?.title || '',
            }))}
            onChange={handleArtworksChange}
            placeholder="Select Artwork"
            isSearchable
            isClearable
          /> */
}

{
  /* <DropdownButton
              id="dropdown-item-button"
              title={
                form.auctionType === 'regular'
                  ? 'Canvas Countdown'
                  : form.auctionType === 'live'
                  ? 'Flash Sale'
                  : 'Auction Type'
              }
              onSelect={handleAuctionTypeSelect}
            >
              <Dropdown.Item eventKey="">Auction Type</Dropdown.Item>
              <Dropdown.Item eventKey="regular">
                Canvas Countdown
              </Dropdown.Item>
              <Dropdown.Item eventKey="live">
                Flash Sale
              </Dropdown.Item>
            </DropdownButton> */
}
const handleAuctionTypeSelect = (eventKey) => {
  setForm({...form, auctionType: eventKey});
};

import io from 'socket.io-client';
import {useEffect, useState} from 'react';

const socket = io.connect(
  `http://localhost:5050?id=6543403250c19caa7ee330c5`,
  {
    extraHeaders: {
      'my-custom-header':
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1M2I0ZGVlYjQzZTQxMWZiOTFlM2I0OSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk5MjA2OTMwLCJleHAiOjE2OTk4MTE3MzB9.wGOjV26eSrOapDKSU2ORqJFuOVQQAuC8Y_TlfdeeZR8',
    },
  }
);

function App() {
  //Room State
  const [room, setRoom] = useState('');

  // Messages States
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  const joinRoom = () => {
    console.log(room);
    if (room !== '') {
      socket.emit('join_auction', room);
    }
  };

  const sendMessage = () => {
    socket.emit('send_bid', {message, room});
  };

  useEffect(() => {
    socket.on('receive_bid', (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;

<BidModal
  handleShow={handleShow}
  show={show}
  artworkId={artworkId}
  currentBid={currentBid}
/>;

import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {AllContext} from '../App';
import {ExibitionList} from './ExibitionList';
import io from 'socket.io-client';

export const LiveShow = () => {
  const {id} = useParams();
  const [show, setShow] = useState(false);
  const {artworks} = useContext(AllContext);
  const [artworkId, setArtworkId] = useState('');
  const artwork = artworks.data.filter(
    (auction) => auction.auction == id
  );
  const handleShow = (artworkNewId) => {
    setArtworkId(artworkNewId);
    setShow((prev) => !prev);
  };
  const currentBid = artworks.myArtworks.find((artwork) => {
    if (artwork._id == artworkId) {
      return artwork;
    }
  })?.currentBidAmount;

  useEffect(() => {
    const socket = io.connect(`http://localhost:5050?id=${id}`, {
      extraHeaders: {
        'my-custom-header': localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <h2>Live show</h2>
      <ExibitionList artworks={artwork} handleShow={handleShow} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            {errors.bid &&
              (errors.bid ==
              'You dont have enough credit to bid, please buy more credit' ? (
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
              {artworks.bid.length != 0 ? artworks.bid : currentBid}
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
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBid}>
            Bid
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


toast.promise(myPromise, {
    pending: "Promise is pending",
    success: "Promise  Loaded",
    error: "error",
  });
}, [])

const orderInfo = artwork?.find((ele) => {
        if (ele.auction.auctionType === 'regular') {
          return ele.auction.bids.length > 0;
        } else if (ele.auction.auctionType === 'live') {
          const allBids = ele.auction.bids.filter(
            (bid) => bid.artwork === ele._id
          );
          return allBids.length > 0;
        }
        return false; // Return false for non-'regular' auctions or unspecified cases
});

 const orderInfo = artwork?.find((ele) => {
        if (ele.auction.auctionType === 'regular') {
          return ele.auction.bids[ele.auction.bids.length - 1];
        } else if (ele.auction.auctionType === 'live') {
          const allBids = ele.auction.bids.filter(
            (bid) => bid.artwork === ele._id
          );
          if (allBids.length > 0) {
            return allBids[allBids.length - 1];
          }
        }
 });


  const artwork = users?.allArtworks?.filter((ele) => {
      return new Date(ele?.auction?.auctionEnd) < new Date();
    });

    const orderInfo = artwork?.find((ele) => {
      if (ele.auction.auctionType === 'regular') {
        return ele.auction.bids[ele.auction.bids.length - 1];
      } else if (ele.auction.auctionType === 'live') {
        const allBids = ele.auction.bids.filter(
          (bid) => bid.artwork === ele._id
        );
        if (allBids.length > 0) {
          return allBids[allBids.length - 1];
        }
      }
    }); // Filter out null/undefined entries
    console.log(orderInfo);
    handleSubmit(orderInfo);
    // try {
    //   const orderResponse = await axios.post('/og/order', orderInfo, {
    //     headers: {
    //       Authorization: localStorage.getItem('token'),
    //     },
    //   });
    //   console.log(orderResponse.data);
    // } catch (error) {
    //   console.log(error);
    // }