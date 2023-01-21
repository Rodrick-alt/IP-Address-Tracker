import React, { useState } from 'react';
import arrow from './images/icon-arrow.svg';
import Map from './components/Map';
import './App.css';

function App() {
  const apiKey = `${process.env.REACT_APP_API_KEY}`;

  const [address, setAddress] = useState('192.212.174.101');
  const [location, setLocation] = useState('Brooklyn, NY 10001');
  const [timezone, setTimezone] = useState('UTC-05:00');
  const [isp, setISP] = useState('SpaceX Starlink');
  const [latLong, setLatLong] = useState([51.505, -0.09]);

  // loading anim style switch
  const [loading, setLoadStyle] = useState('loading-done');

  // handle form input
  const [formInput, setFormInput] = useState('');
  function handleInput(event) {
    setFormInput(event.target.value);
  }

  // handle Response processing
  function handleResponse(response) {
    const obj = JSON.parse(response);
    if (obj.code) {
      console.log("Incorrect Input")
    } else {
      setAddress(obj.ip);
      setLocation(`${obj.location.region}, ${obj.location.city}`);
      setTimezone(`UTC${obj.location.timezone}`);
      setISP(`${obj.isp}`);
      setLatLong((oldarray) => {
        return [oldarray[0] = obj.location.lat, oldarray[1] = obj.location.lng]
      })
    }
  }


  // ajax request to Geolocation api
  function handleSubmit(event) {
    if (formInput !== '' && formInput.match(/\./ig) !== null) {
      event.preventDefault();
      setLoadStyle('loading');
      let parem;

      if (formInput.match(/\./ig).length === 1) {
        parem = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${formInput}`;
      } else {
        parem = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${formInput}`;
      }

      var xhr = new XMLHttpRequest();
      xhr.open("GET", parem);
      xhr.onload = function (event) {
        setLoadStyle('loading-done');
        let target = event.target;
        handleResponse(target.response); // raw response
      };
      xhr.send();
    } else {
      console.log("Incorrect Input")
    }
  }


  window.onload = () => {
    // Ajax requests to Geolocation api with blank Parem
    // default to requesters IP address
    // Test on Safari with Content Blockers Turned Off
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `
      https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=`);
    xhr.onload = function (event) {
      setLoadStyle('loading-done');
      let target = event.target;
      handleResponse(target.response);
    };
    xhr.send();
  }


  return (
    <div id='page-wrapper'>
      <header>
        <h1 id='title'>IP Address Tracker</h1>

        <form id='search-form'>
          <input type='search'
            id='search-input'
            onChange={handleInput}
            required
            placeholder='IP address (8.8.8.8) or domain (Google.com)' />
          <button type='submit' onClick={handleSubmit}>
            <img src={arrow} alt='' />
          </button>
        </form>

        {/* loading anime from LoadingIO */}
        <div id={loading}>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div id='IP-info'>
          <div>
            <h2 className='subHeader'>IP ADDRESS</h2>
            <p id='IP-address'>{address}</p>
          </div>

          <div>
            <h3 className='subHeader'>LOCATION</h3>
            <p id='location'>{location}</p>
          </div>

          <div>
            <h4 className='subHeader'>TIMEZONE</h4>
            <p id='timezone'>{timezone}</p>
          </div>

          <div>
            <h5 className='subHeader'>ISP</h5>
            <p id='ISP'>{isp}</p>
          </div>
        </div>
      </header>

      <main>
        <div id='map'>
          <Map positionNum={latLong} />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export default App;
