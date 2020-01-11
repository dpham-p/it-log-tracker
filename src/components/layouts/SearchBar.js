import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { searchLogs, getLogs } from '../../actions/logActions';
import PropTypes from 'prop-types';

const SearchBar = ({ searchLogs, getLogs }) => {
  const text = useRef('');

  const onChange = e => {
    if (text.current.value) {
      searchLogs(text.current.value);
    } else {
      getLogs();
    }
  };

  return (
    <nav style={{ marginBottom: '30px' }} className='blue'>
      <div className='nav-wrapper'>
        <form>
          <div className='input-field'>
            <input
              id='search'
              type='search'
              placeholder='Search Logs...'
              ref={text}
              onChange={onChange}
            />
            <label className='label-icon' htmlFor='search'>
              <i className='material-icons'>search</i>
            </label>
            <i className='material-icons'>close</i>
          </div>
        </form>
      </div>
    </nav>
  );
};

SearchBar.propTypes = {
  searchLogs: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired
};

export default connect(null, { searchLogs, getLogs })(SearchBar);
