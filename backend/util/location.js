const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };

  // console.log(address);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  // console.log(data);
  let coordinates;

  if (!data || data.status === 'ZERO_RESULTS') {
    console.log(address);
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    // throw error;
    coordinates = {
      lat: 0, lng: 0
    }
  } else {
    coordinates = data.results[0].geometry.location;
  }

  return coordinates;
}

module.exports = getCoordsForAddress;
