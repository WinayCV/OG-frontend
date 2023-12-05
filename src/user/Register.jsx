import {Formik, Form, Field, ErrorMessage} from 'formik';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import * as Yup from 'yup';
import axios from '../config/axios';
import {ToastContainer, toast} from 'react-toastify';


export const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNum: '',
    role: 'user',
  };
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Enter first name'),
    lastName: Yup.string().optional(),
    email: Yup.string()
      .email('Invalid email format')
      .required('Enter Email'),
    password: Yup.string().required('Enter password'),
    mobileNum: Yup.string().required('Enter mobile Number'),
  });

  const onSubmit = async (values, {setFieldError, resetForm}) => {
    if (confirmPassword !== values.password) {
      setError('Passwords do not match');
    } else {
      try {
        const response = await axios.post('/og/register', values);
        toast.success('Registraction sucessfull', {
          position: toast.POSITION.TOP_CENTER,
        });
        setError('');
        resetForm();
        setConfirmPassword('');
        navigate('/bid', {state: {message: response.data.msg}});
      } catch (error) {
        const serverErrors = error.response.data.errors;
        serverErrors.forEach((serverError) => {
          setFieldError(serverError.path, serverError.msg);
        });
        setError('');
      }
    }
  };

  return (
    <div className="container mt-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        onSubmit={onSubmit}
      >
        <Form>
          <ToastContainer />
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              First Name
            </span>
            <Field
              type="text"
              name="firstName"
              className="form-control inputBackground"
              placeholder="Mark"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Last Name
            </span>
            <Field
              type="text"
              name="lastName"
              className="form-control inputBackground"
              placeholder="Flaower"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Email
            </span>
            <Field
              type="text"
              name="email"
              className="form-control inputBackground"
              placeholder="example@gmail.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Password
            </span>
            <Field
              type="password"
              name="password"
              className="form-control inputBackground"
              placeholder="password@123"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Confirm Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="form-control inputBackground"
              placeholder="password@123"
            />
            <span className="text-danger">{error}</span>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Mobile
            </span>
            <Field
              type="number"
              name="mobileNum"
              className="form-control inputBackground"
              placeholder="XXXXXXXXXX"
            />
            <ErrorMessage
              name="mobileNum"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text" id="basic-addon1">
              Role
            </span>
            <div className="d-flex align-items-center justify-content-around w-75 ps-3 pe-3">
              <div className="form-check">
                <Field
                  type="radio"
                  name="role"
                  value="user"
                  className="form-check-input inputBackground"
                />
                <label
                  className="form-check-label"
                  htmlFor="flexRadioDefault1"
                >
                  User
                </label>
              </div>

              <div className="form-check">
                <Field
                  type="radio"
                  name="role"
                  value="artist"
                  className="form-check-input inputBackground"
                />
                <label
                  className="form-check-label"
                  htmlFor="flexRadioDefault2"
                >
                  Artist
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
