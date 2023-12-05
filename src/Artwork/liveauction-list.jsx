import {useContext, useEffect} from 'react';
import {Container, Table} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {AllContext} from '../App';
import axios from '../config/axios';
export const LiveAuctionList = () => {
  const navigate = useNavigate();
  const {users, artworksDispatch} = useContext(AllContext);
  const handleList = (id) => {
    navigate(`/liveShow/${id}`);
  };
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
        console.log(auctionResponse.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div>
      <h2>Live Auction</h2>
      <Container className="container pt-3 mx-auto text-center">
        <div>
          <Table striped="columns">
            <thead>
              <tr>
                <th> Artist</th>
                <th>Artworks</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users?.live.map((auction) => {
                if (auction.auctionType === 'live') {
                  return (
                    <tr
                      key={auction._id}
                      onClick={
                        new Date(auction.auctionEnd) < new Date()
                          ? null
                          : () => {
                              handleList(auction._id);
                            }
                      }
                      style={{cursor: 'pointer'}}
                    >
                      <td>{auction?.artist?.firstName}</td>
                      <td>{auction.artworks.length}</td>
                      <td>
                        {new Date(
                          auction.auctionStart
                        ).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          timeZone: 'Asia/Kolkata',
                        })}
                      </td>
                      <td>
                        {new Date(auction.auctionEnd).toLocaleString(
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
                      <td>
                        {new Date(auction.auctionEnd) > new Date()
                          ? 'Active'
                          : 'Auction Ended'}
                      </td>
                    </tr>
                  );
                }
                return null; // If not a live auction, render nothing for this artwork
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};
