import {isEmpty} from 'lodash';
import {useContext} from 'react';
import {
  Table,
  Card,
  Carousel,
  Col,
  Container,
  Button,
} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {AllContext} from '../App';
import {CountDown} from '../Auction/countDown';

export const ArtworkDetail = () => {
  const {id} = useParams();
  const {artworks} = useContext(AllContext);
  const artwork = artworks.myArtworks.find((ele) => ele._id == id);
  const auctionStart = artwork?.auction?.auctionStart;
  const auctionEnd = artwork?.auction?.auctionEnd;

  return (
    <div>
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
                  {auctionStart && (
                    <CountDown
                      artworks={artworks}
                      auctionStart={auctionStart}
                      auctionEnd={auctionEnd}
                    />
                  )}
                  <Card.Title>{artwork?.title}</Card.Title>
                  <Card.Text>{artwork?.description}</Card.Text>
                </Col>
                <Col xs={12} md={6}>
                  <Container className="text-center">
                    <Card.Title>
                      Search Tags
                      {artwork?.searchTag.map((tag) => {
                        return <li key={tag._id}>{tag.name}</li>;
                      })}
                    </Card.Title>

                    <Card.Text>
                      Current bid - ₹
                      {artworks.bid.length != 0
                        ? artworks.bid
                        : artwork?.currentBidAmount}
                    </Card.Text>
                    {artwork?.auction ? (
                      ''
                    ) : (
                      <Button variant="primary">Edit</Button>
                    )}
                  </Container>
                </Col>
              </Container>
            </div>
          </div>
        </div>
      </Container>
      <div>
        {!isEmpty(artwork?.auction?.bids) && (
          <div>
            <label>All Bids</label>
            <Table striped="columns">
              <thead>
                <tr>
                  <th> Name</th>
                  <th>Bid</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {artwork?.auction.bids.map((bid) => {
                  return (
                    <tr key={bid._id}>
                      <td>{bid.user.firstName}</td>
                      <td>{bid.amount}</td>
                      <td>
                        {new Date(bid.createdAt).toLocaleString(
                          'en-IN',
                          {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: 'Asia/Kolkata',
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
