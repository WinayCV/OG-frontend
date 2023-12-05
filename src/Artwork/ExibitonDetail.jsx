import {isEmpty} from 'lodash';
import {useContext, useEffect, useState} from 'react';
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {AllContext} from '../App';
import axios from '../config/axios';
import {CountDown} from '../Auction/countDown';
import {BidModal} from './BidModel';

export const ExibitionDetail = () => {
  const {id} = useParams();
  const {artworks, artworksDispatch} = useContext(AllContext);

  const [show, setShow] = useState(false);
  // const currentBid = artworks.artwork?.currentBidAmount;
  const auctionStart = artworks?.artwork?.auction?.auctionStart;
  const auctionEnd = artworks?.artwork?.auction?.auctionEnd;

  const handleShow = () => setShow((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/og/artwork/${id}`);
        artworksDispatch({
          type: 'SET_ONE_ARTWORK',
          payload: res.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
    // return here is doing clean up
    return artworksDispatch({type: 'CLEAR_ONE_ARTWORK'});
  }, []);
  const artwork = artworks?.data.find((ele) => ele._id === id);
  return (
    <div>
      <BidModal
        handleShow={handleShow}
        show={show}
        artworkId={id}
        currentBid={artwork?.currentBidAmount}
      />
      <Container className="d-flex align-items-center flex-column">
        <div className="d-flex align-items-center">
          <div className="row">
            <div className="col-8">
              <Carousel className="flex-grow-1">
                {!isEmpty(artwork) &&
                  artwork.images.map((image) => {
                    return (
                      <Carousel.Item key={image._id}>
                        <img
                          src={image.url}
                          className=" w-100 object-fit-sm-contain"
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      </Carousel.Item>
                    );
                  })}
              </Carousel>
            </div>
            <div className="col-4 ">
              <Container className="text-center d-flex flex-column align-items-center flex-shrink-0">
                <Col xs={12} md={6}>
                  <CountDown
                    artworks={artworks}
                    auctionStart={auctionStart}
                    auctionEnd={auctionEnd}
                  />
                  <Card.Title>{artworks.artwork.title}</Card.Title>
                  <Card.Text>
                    {artworks.artwork.description}
                  </Card.Text>
                </Col>
                <Col xs={12} md={6}>
                  <Container className="text-center">
                    <Card.Title>
                      Artist -{artworks.artwork.artist?.firstName}
                    </Card.Title>
                    <Button
                      className="rounded-pill"
                      variant="primary"
                      onClick={handleShow}
                      disabled={
                        new Date(auctionStart) > new Date()
                          ? true
                          : false
                      }
                    >
                      Place Bid
                    </Button>
                    <Card.Text>
                      Current bid - ₹{artwork?.currentBidAmount}
                    </Card.Text>
                  </Container>
                </Col>
              </Container>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
