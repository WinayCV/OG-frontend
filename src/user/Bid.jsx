import {useState} from 'react';
import {Login} from './Login';
import {Register} from './Register';
import {useLocation} from 'react-router-dom';

export const Bid = () => {
  const location = useLocation();
  let message = location.state?.message;

  const [loginToggle, setLoginToggle] = useState(true);

  const handleChange = () => {
    setLoginToggle(!loginToggle);
    message = 'Welcome';
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{height: '90vh'}}
    >
      {message ? message : ''}
      <h2>{loginToggle ? 'Login' : 'Register'}</h2>
      <p className="mb-3">Discover masterpieces, bid with passion</p>
      <div>{loginToggle ? <Login /> : <Register />}</div>
      {loginToggle ? (
        <p className="mt-5">
          Dont have an account?
          <button
            onClick={handleChange}
            name="Register"
            className="bg-transparent border border-0"
          >
            Register
          </button>
          for free
        </p>
      ) : (
        <p className="mt-5">
          Have an account?
          <button
            onClick={handleChange}
            name="Login"
            className="bg-transparent border border-0"
          >
            Login
          </button>
        </p>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fixed-bottom"
        style={{zIndex: '-10'}}
      >
        <path
          fill="#0099ff"
          fillOpacity="1"
          d="M0,64L40,64C80,64,160,64,240,101.3C320,139,400,213,480,240C560,267,640,245,720,229.3C800,213,880,203,960,186.7C1040,171,1120,149,1200,165.3C1280,181,1360,235,1400,261.3L1440,288L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};
