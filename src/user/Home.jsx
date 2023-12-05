import Footer from './footer';
import background from '../assets/background.png';
import {useNavigate} from 'react-router-dom';
export const Home = () => {
  const navigate = useNavigate();
  const handleStartBidding = () => {
    navigate('/exibition/list');
  };
  return (
    <div>
      <div
        className="p-5 text-center bg-image d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${background})`,
          height: '75vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="mask p-2 d-flex align-items-center rounded"
          style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
        >
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <h1 className="">
                Discover Inspiring Artistry: Explore a Gallery of
                Captivating Creations
              </h1>

              <a
                className="btn btn-outline-light btn-lg"
                onClick={handleStartBidding}
                role="button"
              >
                Start Bidding
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
