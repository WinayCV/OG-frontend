import {jwtDecode} from 'jwt-decode';
import {createContext, useEffect, useReducer} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Route, Routes} from 'react-router-dom';
import {Exibition} from './Artwork/Exibiton';
import {ExibitionDetail} from './Artwork/ExibitonDetail';
import {LiveShow} from './Artwork/LiveShow';
import {LiveAuctionList} from './Artwork/liveauction-list';
import {AuctionDetails} from './Auction/auction-details';
import {CreateArtwork} from './artist/Create-Artwork';
import {CreateAuction} from './artist/Create-Auction';
import {ArtworkDetail} from './artist/artwork-detail';
import {ArtworkList} from './artist/artwork-list';
import {AuctionList} from './artist/auction-List';
import NavBar from './config/Nav';
import axios from './config/axios';
import {artworksReducer} from './reducer/artworks-Reducer';
import {userReducer} from './reducer/users-Reducer';
import {Bid} from './user/Bid';
import {Home} from './user/Home';
import {Login} from './user/Login';
import {Profile} from './user/Profile';
import {Register} from './user/Register';
import {startGetAddress} from './action/addressAction';

export const loginCall = async (usersDispatch, artworksDispatch) => {
  if (localStorage.getItem('token')) {
    try {
      const response = await axios.get('/og/getProfile', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      });

      usersDispatch({
        type: 'SET_USER',
        payload: response.data.user,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get('/og/auction/live', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      });
      usersDispatch({
        type: 'SET_LIVE_AUCTION',
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }
  try {
    const auctionResponse = await axios.get(
      `/og/auction/exhibition?page=${0}&sort=${-1}`
    );
    artworksDispatch({
      type: 'SET_EXIBITION',
      payload: auctionResponse.data,
    });
  } catch (error) {
    console.log(error);
  }

  if (
    localStorage.getItem('token') &&
    jwtDecode(localStorage.getItem('token')).role == 'artist'
  ) {
    try {
      const artworkResponse = await axios.get(`/og/artwork/list`, {
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
  }
};
export const AllContext = createContext();
function App() {
  const dispatch = useDispatch();
  const address = useSelector((state) => {
    return state?.address?.myAddress;
  });
  const [users, usersDispatch] = useReducer(userReducer, {
    data: {},
    live: [],
    allArtworks: [],
    resOrder: [],
  });
  const [artworks, artworksDispatch] = useReducer(artworksReducer, {
    data: [],
    artwork: {},
    bid: [],
    myArtworks: [],
    myAuctions: [],
  });
  useEffect(() => {
    dispatch(startGetAddress());
    loginCall(usersDispatch, artworksDispatch, dispatch);
    (async () => {
      try {
        const artworksResponse = await axios('/og/artwork/all');
        usersDispatch({
          type: 'ALL_ARTWORKS',
          payload: artworksResponse.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <AllContext.Provider
      value={{
        users,
        usersDispatch,
        artworks,
        artworksDispatch,
      }}
    >
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exibition/list" element={<Exibition />} />
          <Route path="/bid" element={<Bid />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/exibition/:id"
            element={<ExibitionDetail />}
          />
          <Route path="/createArtwork" element={<CreateArtwork />} />
          <Route path="/createAuction" element={<CreateAuction />} />
          <Route path="/artworkList" element={<ArtworkList />} />
          <Route
            path="/artworkList/:id"
            element={<ArtworkDetail />}
          />
          <Route path="/auctionList" element={<AuctionList />} />
          <Route
            path="/auctionDetails"
            element={<AuctionDetails />}
          />
          <Route path="/liveauction" element={<LiveAuctionList />} />
          <Route path="/liveShow/:id" element={<LiveShow />} />
        </Routes>
      </div>
    </AllContext.Provider>
  );
}

export default App;
