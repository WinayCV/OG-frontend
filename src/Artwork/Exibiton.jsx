import {useContext, useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {AllContext} from '../App';
import axios from '../config/axios';
import SearchPage from '../config/searchBar';
import {ExibitionItem} from './ExibitionItem';
import {useNavigate} from 'react-router-dom';

export const Exibition = () => {
  const {artworks, artworksDispatch} = useContext(AllContext);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(1);
  const navigate = useNavigate();

  const handleShow = (artworkId, bid, auctionId) => {
    console.log(artworkId, bid, auctionId);
    navigate(`/liveShow/${auctionId}`);
  };
  const handleNext = () => {
    setPage(page + 6);
  };
  const handlePrev = () => {
    if (page != 0) {
      setPage(page - 6);
    }
  };
  const handleSort = () => {
    setSort(-sort);
  };
  useEffect(() => {
    (async () => {
      try {
        const auctionResponse = await axios.get(
          `/og/auction/exhibition?page=${page}&sort=${sort}`
        );
        artworksDispatch({
          type: 'SET_EXIBITION',
          payload: auctionResponse.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, sort]);
  return (
    <div>
      <SearchPage handleSort={handleSort} />

      <Container className="container pt-3 mx-auto text-center">
        <Row
          xs={1}
          md={2}
          lg={2}
          xl={3}
          className="g-4 justify-content-center"
        >
          {artworks.length != 0 &&
            artworks?.data.map((artwork) => (
              <Col
                key={artwork._id}
                className="mb-3 d-flex align-items-center"
              >
                <ExibitionItem
                  artwork={artwork}
                  artworks={artworks}
                  handleShow={handleShow}
                />
              </Col>
            ))}
        </Row>
        {artworks.data.length > 6 ? (
          ''
        ) : artworks.data.length === 0 ? (
          ''
        ) : (
          <>
            <Button
              onClick={handlePrev}
              disabled={page == 0 && true}
              className="rounded-pill"
            >
              Prev
            </Button>
            <Button
              onClick={handleNext}
              disabled={artworks.data.length != 6 && true}
              className="rounded-pill"
            >
              Next
            </Button>
          </>
        )}
      </Container>
    </div>
  );
};
