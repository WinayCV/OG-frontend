import {MDBCol, MDBIcon} from 'mdbreact';
import {useContext, useEffect, useState} from 'react';
import axios from '../config/axios';
import {AllContext} from '../App';
import {Button} from 'react-bootstrap';

const SearchPage = ({handleSort}) => {
  const {artworksDispatch} = useContext(AllContext);
  const [search, setSearch] = useState('');
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    console.log(search.length);
    try {
      const auctionResponse = await axios.get(
        `/og/auction/active?search=${e.target.value}`
      );
      artworksDispatch({
        type: 'SET_EXIBITION',
        payload: auctionResponse.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search.length === 0) {
      (async () => {
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
      })();
    }
  }, [search]);

  return (
    <MDBCol md="6" className="mx-auto text-center">
      <div className="input-group md-form form-sm form-1">
        <span className="input-group-text blue" id="basic-text1">
          <MDBIcon icon="search" className="text-white" />
        </span>

        <input
          className="form-control my-0 py-1"
          type="text"
          placeholder="Search based on interest"
          aria-label="Search"
          onChange={handleSearch}
          style={{marginLeft: '5px', marginRight: '5px'}}
        />
        <span
          className="input-group-text blue "
          id="basic-text1"
          onClick={handleSort}
          style={{cursor: 'pointer'}}
        >
          <MDBIcon icon="sort" className="text-white" />
        </span>
      </div>
    </MDBCol>
  );
};

export default SearchPage;
