import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import {isEmpty} from 'lodash';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {FilePond, registerPlugin} from 'react-filepond';
import {ToastContainer, toast} from 'react-toastify';
import axios from '../config/axios';
import './createArtworkStyles.css';
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

import {useNavigate} from 'react-router-dom';
import {ReactSelect} from './ReactSelect';
export const CreateArtwork = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState([]);
  const [currentBidAmount, setCurrentBidAmount] = useState('');
  const [selectedTag, setSelectedTag] = useState([]);
  const [description, setDescription] = useState('');
  const handleFileUpload = (files) => {
    setFiles(files.map((ele) => ele.file));
  };
  const newErrors = {};
  const runValidation = () => {
    if (title == '') {
      newErrors.title = 'Title cannot be empty';
    }
    if (description == '') {
      newErrors.description = 'Description cannot be empty';
    }
    if (selectedTag.length < 2) {
      newErrors.searchTag =
        'Minimum 2 tags required,it makes your painting more accessable';
    }
    if (files.length < 3) {
      newErrors.images = 'Minimum 3 images required';
    }
    if (currentBidAmount.length == '') {
      newErrors.currentBidAmount = 'Your initial amount is empty';
    }
    setErrors(newErrors);
    return newErrors;
  };
  useEffect(() => {
    (async () => {
      try {
        const tagResponse = await axios.get('/og/artworktag');
        setTags(tagResponse.data);
      } catch (error) {
        console.log({error});
      }
    })();
  }, []);
  const getSelectedTag = (data) => {
    const newtags = data.map((tag) => {
      return tag.value;
    });
    setSelectedTag(newtags);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(runValidation())) {
      console.log('object');
      setErrors({});
      const body = new FormData();
      body.append('title', title);
      body.append('description', description);
      body.append('currentBidAmount', currentBidAmount);

      selectedTag.forEach((value) => {
        body.append(`searchTag`, value);
      });

      files.forEach((file) => {
        body.append(`files`, file);
      });
      try {
        setLoading(true);
        const response = await axios.post(
          '/og/artwork/create',
          body,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        toast.success('Artwork created sucessfully', {
          position: toast.POSITION.TOP_CENTER,
        });
        setTitle('');
        setDescription('');
        setSelectedTag([]);
        setFiles([]);
        setCurrentBidAmount('');
        setLoading(false);
        navigate('/artworkList');
      } catch (error) {
        console.log({error});
        setLoading(false);
        alert(error.response.data.error);
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="content">
        <div className="container">
          <h2 className="text-center mb-5">Create artwork</h2>
          <ToastContainer />
          <form onSubmit={handleSubmit} className="row">
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
            <div className="input-group flex-nowrap mb-3">
              <span className="input-group-text">Title</span>
              <div style={{position: 'relative', width: '100%'}}>
                <input
                  type="text"
                  id="title"
                  className={`form-control col-12 ${
                    errors.title && 'is-invalid'
                  }`}
                  style={{width: '100%'}}
                  placeholder="Oil painting..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-35%',
                    }}
                  >
                    {errors.title}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group flex-nowrap mt-3 mb-3">
              <span className="input-group-text">
                Initial Bid amount
              </span>
              <div style={{position: 'relative', width: '100%'}}>
                <input
                  type="number"
                  id="currentBidAmount"
                  style={{width: '100%'}}
                  placeholder="₹xxxxxxx"
                  className={`form-control ${
                    errors.currentBidAmount && 'is-invalid'
                  }`}
                  value={currentBidAmount}
                  onChange={(e) =>
                    setCurrentBidAmount(e.target.value)
                  }
                />
                {errors.currentBidAmount && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-29%',
                    }}
                  >
                    {errors.currentBidAmount}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group flex-nowrap mt-3 mb-3">
              <span className="input-group-text">Description</span>
              <div style={{position: 'relative', width: '100%'}}>
                <textarea
                  id="description"
                  style={{width: '100%'}}
                  className={`form-control ${
                    errors.description && 'is-invalid'
                  }`}
                  rows={1}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-30%',
                    }}
                  >
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group flex-nowrap mt-3 mb-3">
              <span className="input-group-text" id="addon-wrapping">
                Search Tags
              </span>
              <div style={{position: 'relative', width: '100%'}}>
                <div
                  className={`form-control ${
                    errors.searchTag && 'is-invalid'
                  }`}
                >
                  <ReactSelect
                    tags={tags}
                    getSelectedTag={getSelectedTag}
                  />
                </div>
                {errors.searchTag && (
                  <div
                    className="invalid-feedback d-block"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-10%',
                    }}
                  >
                    {errors.searchTag}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 mb-3">
              <span className="input-group-text">Upload Images</span>
              <div style={{position: 'relative', width: '100%'}}>
                <div
                  className={`form-control ${
                    errors.images && 'is-invalid'
                  }`}
                >
                  <FilePond
                    files={files}
                    onupdatefiles={handleFileUpload}
                    allowMultiple={true}
                    maxFiles={3}
                    name="files"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
                {errors.images && (
                  <div
                    className="invalid-feedback d-block"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-35%',
                    }}
                  >
                    {errors.images}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-3 col-12"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
