import {useContext, useEffect, useState} from 'react';
import Badge from 'react-bootstrap/Badge';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from 'react-bootstrap/ListGroup';
import {AllContext} from '../App';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from '../config/axios';

export const AuctionList = () => {
  const {artworks, artworksDispatch} = useContext(AllContext);
  const navigate = useNavigate();
  const [openArtworks, setOpenArtworks] = useState({});

  const handleCreateAuction = () => {
    navigate('/createAuction');
  };

  const handleAuctionDetails = (id) => {
    navigate('/auctionDetails', {state: id});
  };

  useEffect(() => {
    (async () => {
      try {
        const auctionResponse = await axios.get('/og/myauction', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
        });
        artworksDispatch({
          type: 'SET_MY_AUCTIONS',
          payload: auctionResponse.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <h2>AuctionList</h2>
      {artworks.myAuctions.length == 0 && (
        <span>
          No auctions created{' '}
          <Button
            className="bg-transparent border border-0"
            onClick={handleCreateAuction}
          >
            <b
              style={{
                color: 'blue',
                textDecoration: 'underline',
              }}
            >
              create auction?
            </b>
          </Button>
        </span>
      )}
      {
        <ListGroup as="ol" numbered>
          {artworks.myAuctions.map((auction) => {
            const isOpen = openArtworks[auction._id] || false;
            return (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                key={auction._id}
              >
                <div className="ms-2 me-auto">
                  <div
                    className="fw-bold "
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setOpenArtworks((prevOpenArtworks) => ({
                        ...prevOpenArtworks,
                        [auction._id]: !isOpen,
                      }));
                    }}
                  >
                    <div className="row">
                      {auction.artworks.length > 1 ? (
                        auction.artworks.map((artwork) => (
                          <div key={artwork._id}>
                            <p>{artwork.title}</p>
                          </div>
                        ))
                      ) : (
                        <div>
                          <p>{auction.artworks[0].title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Collapse in={isOpen}>
                    <div id={`collapse-${auction._id}`}>
                      <Button
                        onClick={() => {
                          handleAuctionDetails(auction._id);
                        }}
                      >
                        Show more
                      </Button>
                    </div>
                  </Collapse>
                </div>
                <Badge bg="primary" pill>
                  {<p> Bids-{auction.bids.length}</p>}
                </Badge>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      }
    </div>
  );
};
