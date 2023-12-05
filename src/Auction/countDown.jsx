/* eslint-disable react/prop-types */
import Countdown from 'react-countdown';
import axios from '../config/axios';
export const CountDown = (props) => {
  const {auctionStart, auctionEnd, artworkId} = props;

  const handleComplete = async () => {
    try {
      const orderResponse = await axios.post(
        '/og/order',
        {artworkId},
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      console.log(orderResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderer = ({days, hours, minutes, seconds, completed}) => {
    if (completed) {
      // after auction ends
      handleComplete();
      return 'Bid has ended';
    } else {
      // Render a countdown
      return (
        // <span>
        //   {days}
        //   {days > 2 ? ' days ' : ' day '}:{hours}hr :{minutes}
        //   min :{seconds}
        // </span>
        <span>
          {days > 0 && <>{days.toString().padStart(2, '0')}d </>}
          {hours > 0 && <>{hours.toString().padStart(2, '0')}h </>}
          {minutes > 0 && (
            <>{minutes.toString().padStart(2, '0')}m </>
          )}
          {seconds > 0 && `${seconds.toString().padStart(2, '0')}s`}
        </span>
      );
    }
  };
  return (
    <div
      style={{backgroundColor: '#FFDAB9'}}
      className=" rounded-pill p-1 px-2"
    >
      {new Date(auctionStart) > new Date() ? (
        <span>
          {/* Get ready to bid in: */}
          <Countdown
            date={new Date(auctionStart)}
            renderer={renderer}
          ></Countdown>
        </span>
      ) : (
        <span>
          {/* Time running out: */}
          <Countdown
            date={new Date(auctionEnd)}
            renderer={renderer}
          ></Countdown>
        </span>
      )}
    </div>
  );
};
