import {isEmpty} from 'lodash';
import {useContext, useState} from 'react';
import {Dropdown, DropdownButton, Form} from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import {AllContext} from '../App';
import axios from '../config/axios';
import './createAuctionStyles.css';
import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';

export const CreateAuction = () => {
  const {artworks, artworksDispatch} = useContext(AllContext);
  const [errors, setErrors] = useState({});
  const [selectArtwork, setSelectArtwork] = useState({});
  const newErrors = {};
  const [form, setForm] = useState({
    auctionStart: '',
    auctionType: '',
    auctionEnd: '',
    artworks: [],
  });
  const navigate = useNavigate();
  const options = artworks?.myArtworks
    .filter((artwork) => {
      if (isEmpty(artwork?.auction)) {
        return artwork;
      }
    })
    .map((ele) => {
      return {value: ele._id, label: ele.title};
    });

  const handleArtworksChange = (selectedArtworks) => {
    // Handle selected artworks here
    const selectedValues = selectedArtworks.map(
      (option) => option.value
    );
    setForm({
      ...form,
      artworks: selectedValues,
    });
  };
  const handleArtworkTitleSelect = (selectedTitle) => {
    // Find the artwork based on the selected title
    const selectedArtwork = artworks?.myArtworks.find(
      (artwork) => artwork.title === selectedTitle
    );
    console.log(selectedArtwork);
    if (selectedArtwork) {
      setSelectArtwork(selectedArtwork);
      const selectedLabel = selectedArtwork?._id;
      setForm({...form, artworks: [selectedLabel]});
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});
  };

  const runValidation = () => {
    if (form.auctionEnd == '') {
      newErrors.auctionEnd = 'Please enter valid date';
    } else if (form.auctionEnd < form.auctionStart) {
      newErrors.auctionEnd =
        'End date should be greater than Start date';
    } else if (
      new Date(form.auctionEnd) < new Date().toLocaleTimeString
    ) {
      newErrors.auctionEnd = 'End date cannot be less than today';
    }
    if (form.auctionStart == '') {
      newErrors.auctionStart = 'Please enter valid date';
    } else if (new Date(form.auctionStart) < new Date()) {
      newErrors.auctionStart = 'End date cannot be less than today';
    }
    if (form.auctionType == '') {
      newErrors.auctionType = 'Please select auction type';
    }
    if (form.artworks.length == 0 && form.auctionType == 'regular') {
      newErrors.artworks = 'Please select artworks';
    }
    if (form.artworks.length <= 4 && form.auctionType == 'live') {
      newErrors.artworks = 'Please select Minimum 5 artworks';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault(e);
    if (isEmpty(runValidation())) {
      console.log(form);
      try {
        const auctionResponse = await axios.post(
          'og/auction/create',
          form,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        artworksDispatch({
          type: 'SET_MY_AUCTIONS',
          payload: auctionResponse.data,
        });
        setForm({
          auctionStart: '',
          auctionType: '',
          auctionEnd: '',
          artworks: [],
        });
        setErrors({});
        toast.success('Auction created sucessfully', {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate('/auctionList');
      } catch (error) {
        console.log(error);
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
          <h2 className="text-center mb-5">Create Auction</h2>
          <form onSubmit={handleSubmit} className="row">
            <div key={'radio'} className="mb-3">
              <Form.Check
                type={'radio'}
                label={'Canvas Countdown'}
                id={'regular'}
                name="auctionType"
                value="regular"
                checked={form.auctionType === 'regular'}
                onChange={(e) =>
                  setForm({...form, auctionType: e.target.value})
                }
              />

              <Form.Check
                type={'radio'}
                label={'Flash Sale'}
                id={'live'}
                name="auctionType"
                value="live"
                checked={form.auctionType === 'live'}
                onChange={(e) =>
                  setForm({...form, auctionType: e.target.value})
                }
              />
            </div>

            <span>
              {errors.auctionType && (
                <p style={{color: 'red'}}>{errors.auctionType}</p>
              )}
            </span>
            <div className="input-group flex-nowrap mb-3">
              <span className="input-group-text" id="addon-wrapping">
                Auction start date
              </span>
              <div style={{position: 'relative', width: '100%'}}>
                <input
                  type="datetime-local"
                  className={`form-control col-12 ${
                    errors.auctionStart && 'is-invalid'
                  }`}
                  style={{width: '100%'}}
                  aria-label="auctionStart"
                  aria-describedby="addon-wrapping"
                  name="auctionStart"
                  value={form.auctionStart}
                  onChange={handleChange}
                />
                {errors.auctionStart && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-35%',
                    }}
                  >
                    {errors.auctionStart}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group flex-nowrap mt-3 mb-3">
              <span className="input-group-text" id="addon-wrapping">
                Auction end date
              </span>
              <div style={{position: 'relative', width: '100%'}}>
                <input
                  type="datetime-local"
                  className={`form-control col-12 ${
                    errors.auctionEnd && 'is-invalid'
                  }`}
                  aria-label="auctionEnd"
                  aria-describedby="addon-wrapping"
                  name="auctionEnd"
                  value={form.auctionEnd}
                  onChange={handleChange}
                />
                {errors.auctionEnd && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-35%',
                    }}
                  >
                    {errors.auctionEnd}
                  </div>
                )}
              </div>
            </div>
            <div className="input-group flex-nowrap mt-3 mb-3">
              <span className="input-group-text" id="addon-wrapping">
                Artworks
              </span>
              <div style={{position: 'relative', width: '100%'}}>
                {form.auctionType == 'regular' ? (
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={
                      selectArtwork && selectArtwork._id
                        ? selectArtwork.title
                        : 'Select Artwork'
                    }
                    onSelect={handleArtworkTitleSelect}
                  >
                    <Dropdown.Item eventKey="">
                      Select Artwork
                    </Dropdown.Item>
                    {artworks?.myArtworks
                      .filter((ele) => isEmpty(ele.auction))
                      .map((artwork) => (
                        <Dropdown.Item
                          key={artwork._id}
                          eventKey={artwork.title}
                        >
                          {artwork.title}
                        </Dropdown.Item>
                      ))}
                  </DropdownButton>
                ) : (
                  <CreatableSelect
                    isMulti
                    // Update the options prop with the actual options for artworks
                    options={options}
                    className={`form-control col-12 ${
                      errors.auctionEnd && 'is-invalid'
                    }`}
                    value={form.artworks.map((id) => ({
                      value: id,
                      label:
                        artworks?.myArtworks.find(
                          (artwork) => artwork._id === id
                        )?.title || '',
                    }))}
                    onChange={handleArtworksChange}
                    placeholder="Select Artworks"
                    isSearchable
                    isClearable
                  />
                )}

                {errors.artworks && (
                  <div
                    className="invalid-feedback"
                    style={{
                      position: 'absolute',
                      bottom: '-1.5em',
                      right: '-35%',
                    }}
                  >
                    {errors.artworks}
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary  mt-3">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
