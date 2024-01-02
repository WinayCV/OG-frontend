import {useContext, useState} from 'react';
import axios from '../config/axios';
import {useNavigate} from 'react-router-dom';
import {Spinner} from 'react-bootstrap';
import {AllContext} from '../App';
import {loginCall} from '../App';
import {useDispatch} from 'react-redux';
import {startGetAddress} from '../action/addressAction';
import Footer from './footer';

export const Login = () => {
  const {usersDispatch, artworksDispatch} = useContext(AllContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const newErrors = {};
  const runValidation = () => {
    if (form.email.trim().length === 0) {
      newErrors.email = 'Enter email';
    }
    if (form.password.trim().length === 0) {
      newErrors.password = 'Enter password';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(runValidation()).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post('/og/login', form);
        localStorage.setItem('token', response.data.token);
        usersDispatch({
          type: 'SET_USER',
          payload: response.data.user,
        });
        loginCall(usersDispatch, artworksDispatch);
        setLoading(false);
        dispatch(startGetAddress());
        navigate('/');
        setErrors({});
      } catch (error) {
        const serverError = error.response.data.errors.reduce(
          (pv, cv) => {
            if (error.response.data.errors.path) {
              // eslint-disable-next-line no-prototype-builtins
              if (!pv.hasOwnProperty(cv.path ? cv.path : 'msg')) {
                pv[cv.path] = cv.msg;
              }
              return pv;
            } else {
              pv['email'] = cv.msg;
              return pv;
            }
          },
          {}
        );
        setErrors(serverError);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="d-flex align-items-center flex-column"
      >
        {loading && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 1000,
            }}
          />
        )}

        {loading && (
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{
              zIndex: 1001,
            }}
          >
            <Spinner animation="border" size="lg" />
          </div>
        )}
        <div className="input-group flex-nowrap">
          <span className="input-group-text" id="addon-wrapping">
            Email
          </span>
          <input
            type="text"
            className={`form-control ${
              errors.email ? 'is-invalid' : ''
            }`}
            placeholder="example@gmail.com"
            aria-label="Email"
            aria-describedby="addon-wrapping"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <div className="text-danger mt-1">{errors.email}</div>
        )}
        <div className="input-group flex-nowrap mt-3">
          <span className="input-group-text" id="addon-wrapping">
            Password
          </span>
          <input
            type="password"
            className={`form-control ${
              errors.password ? 'is-invalid' : ''
            }`}
            aria-label="Password"
            aria-describedby="addon-wrapping"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        {errors.password && (
          <div className="text-danger mt-1">{errors.password}</div>
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </>
  );
};

export default Login;
