import {useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AllContext} from '../App';
import logo from '../assets/logo.jpg';
import axios from './axios';
import {jwtDecode} from 'jwt-decode';
import {useSelector} from 'react-redux';
const NavBar = () => {
  const address = useSelector((state) => {
    return state?.address?.myAddress;
  });

  const navigate = useNavigate();
  const {users, artworksDispatch, usersDispatch} =
    useContext(AllContext);

  const navigateLogin = async (e, str) => {
    e.preventDefault();
    if (localStorage.getItem('token') && str == 'regular') {
      console.log(str);
      try {
        const auctionResponse = await axios.get(
          `/og/auction/active?type=${str}`
        );
        artworksDispatch({
          type: 'SET_EXIBITION',
          payload: auctionResponse.data,
        });
        navigate('/exibition/list');
      } catch (error) {
        console.log(error);
      }
    } else if (localStorage.getItem('token') && str == 'live') {
      navigate('/liveauction');
    } else if (str == '') {
      try {
        const auctionResponse = await axios.get(
          `/og/auction/exhibition?page=${0}&sort=${-1}`
        );
        artworksDispatch({
          type: 'SET_EXIBITION',
          payload: auctionResponse.data,
        });
        navigate('/exibition/list');
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error('Please Login before Bid', {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/bid');
    }
  };
  const handleLogout = (e) => {
    e.preventDefault();
    usersDispatch({type: 'CLEAR_DATA'});
    artworksDispatch({type: 'CLEAR_DATA'});
    localStorage.clear();

    navigate('/bid');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <ToastContainer />
      <Container>
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
        >
          <img
            src={logo}
            alt="logo"
            width="50"
            height="50"
            className="d-inline-block shadow-sm align-text-top"
            style={{borderRadius: '50%'}}
          />
          <span
            style={{
              marginLeft: '1px',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'black',
              marginTop: '2px',
            }}
          >
            Online Gallery
          </span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className="d-flex align-items-center ms-auto">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {localStorage.getItem('token') &&
              jwtDecode(localStorage.getItem('token')).role ==
                'artist'
                ? address.length != 0 && (
                    <NavDropdown
                      title="Create"
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/createArtwork">
                        Create Artwork
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/createAuction">
                        Create Auction
                      </NavDropdown.Item>
                    </NavDropdown>
                  )
                : ''}
              <Nav.Link
                as={Link}
                onClick={(e) => {
                  navigateLogin(e, '');
                }}
                style={{color: 'black'}}
              >
                Exibition
              </Nav.Link>
              {address.length != 0 && (
                <NavDropdown title="Auction" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    onClick={(e) => {
                      navigateLogin(e, 'live');
                    }}
                  >
                    Flash Sale
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={(e) => {
                      navigateLogin(e, 'regular');
                    }}
                  >
                    Canvas Countdown
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {localStorage.getItem('token') ? (
                <>
                  {localStorage.getItem('token') &&
                  address.length != 0 &&
                  jwtDecode(localStorage.getItem('token')).role ==
                    'artist' ? (
                    <NavDropdown
                      title="Profile"
                      id="basic-nav-dropdown"
                    >
                      <Nav.Link
                        as={Link}
                        to="/profile"
                        style={{color: 'black'}}
                      >
                        My Info
                      </Nav.Link>

                      <NavDropdown.Item as={Link} to="/artworkList">
                        My Artwork
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/auctionList">
                        My Auction
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      style={{color: 'black'}}
                    >
                      Profile
                    </Nav.Link>
                  )}
                  <Nav.Link
                    as={Link}
                    to="/logout"
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                    style={{color: 'black'}}
                  >
                    Logout
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    style={{color: 'black'}}
                  >
                    Credit:₹{users.data.credit}
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/bid"
                  style={{color: 'black'}}
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
