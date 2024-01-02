import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {ExibitionItem} from './ExibitionItem';

export const ExibitionList = (props) => {
  const {artworks, handleShow} = props;

  return (
    <div>
      <Container className="container pt-3 mx-auto text-center">
        <Row
          xs={1}
          md={2}
          lg={2}
          xl={3}
          className="g-4 justify-content-center"
        >
          {artworks?.length != 0 &&
            artworks?.map((artwork) => (
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
      </Container>
    </div>
  );
};
