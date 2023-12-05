import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import {useContext, useEffect, useState} from 'react';
import axios from '../config/axios';
import {Button} from 'react-bootstrap';
import Collapse from 'react-bootstrap/Collapse';
import {useNavigate} from 'react-router-dom';
import {AllContext} from '../App';

export const ArtworkList = () => {
  const navigate = useNavigate();
  const {artworks, artworksDispatch} = useContext(AllContext);
  const [openArtworks, setOpenArtworks] = useState({});
  const handleNavigate = (id) => {
    navigate(`/artworkList/${id}`);
  };
  console.log(artworks);
  const handleCreateArtwork = () => {
    navigate('/createArtwork');
  };

  useEffect(() => {
    (async () => {
      try {
        const artworkResponse = await axios.get('/og/artwork/list', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
        });
        artworksDispatch({
          type: 'SET_ALL_ARTWORKS',
          payload: artworkResponse.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div>
      <h2>Artwork list</h2>
      {artworks.myArtworks.length == 0 && (
        <span>
          No Artworks created
          <Button
            className="bg-transparent border border-0"
            onClick={handleCreateArtwork}
          >
            <b
              style={{
                color: 'blue',
                textDecoration: 'underline',
              }}
            >
              create Artwork?
            </b>{' '}
          </Button>{' '}
        </span>
      )}
      {artworks.myArtworks && (
        <ListGroup as="ol" numbered>
          {artworks.myArtworks.map((artwork) => {
            const isOpen = openArtworks[artwork._id] || false;
            return (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                key={artwork._id}
              >
                <div className="ms-2 me-auto">
                  <div
                    className="fw-bold "
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setOpenArtworks((prevOpenArtworks) => ({
                        ...prevOpenArtworks,
                        [artwork._id]: !isOpen,
                      }));
                    }}
                  >
                    {artwork.title}
                  </div>
                  <Collapse in={isOpen}>
                    <div id={`collapse-${artwork._id}`}>
                      Current Bid:{artwork.currentBidAmount}
                      {'  '}
                      Status :{artwork.status} {'  '}
                      <Button
                        onClick={() => {
                          handleNavigate(artwork._id);
                        }}
                      >
                        Show more
                      </Button>
                    </div>
                  </Collapse>
                </div>
                <Badge bg="primary" pill>
                  {artwork.auction?.bids ? (
                    <p> Bids-{artwork.auction?.bids.length}</p>
                  ) : (
                    ''
                  )}
                </Badge>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};
