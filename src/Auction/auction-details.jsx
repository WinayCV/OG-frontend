import {useContext} from 'react';
import {Table} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import {AllContext} from '../App';
export const AuctionDetails = () => {
  const {artworks} = useContext(AllContext);
  const location = useLocation();
  const id = location.state;

  const liveBids = artworks?.myAuctions?.find((ele) => {
    return ele._id == id;
  })?.bids;

  console.log(liveBids);
  return (
    <div>
      <h2>AuctionDetails</h2>
      <Table striped="columns">
        <thead>
          <tr>
            <th> Title</th>
            <th>User</th>
            <th>Bid Amount</th>
            <th> Bid time</th>
          </tr>
        </thead>
        <tbody>
          {liveBids?.map((bid) => {
            return (
              <tr
                key={bid._id}
                // onClick={() => {
                //   handleList(auction._id);
                // }}
                style={{cursor: 'pointer'}}
              >
                <td>{bid?.artwork?.title}</td>
                <td>{bid?.user?.firstName}</td>
                <td>{bid?.amount}</td>
                <td>
                  {new Date(bid?.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Kolkata',
                  })}
                </td>
                {/* <td>
                  {new Date(auction.auctionStart).toLocaleString(
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
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
