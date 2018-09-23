/** Holds the code for additional computation aside from the
* handler itsel.
*/

const _ = require('lodash');
const axios = require('axios');
const functions = require('firebase-functions');

const config = functions.config();

const GOOGLE_MAPS_API_KEY = _.get(config, 'google_map.api_key');
if (_.isEmpty(GOOGLE_MAPS_API_KEY)) {
  throw new Error('Missing Google Maps API key');
}

const GOOGLE_MAPS_REVERSE_GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAPS_REVERSE_GEOCODE_URL = `${GOOGLE_MAPS_REVERSE_GEOCODE_BASE_URL}?key=${GOOGLE_MAPS_API_KEY}`;


/**
 * Gets the address from the coordinates using the here geocode API.
 * https://developer.here.com/documentation/geocoder/topics/resource-reverse-geocode.html
 * @param {number} latitude
 * @param {number} longitude
 * @return {Promise<string>}
 */
const getAddressFromLatLon = (latitude, longitude) => {
  const searchAddressUrl = `${GOOGLE_MAPS_REVERSE_GEOCODE_URL}&latlng=${latitude},${longitude}`;
  console.log('URL queried:', searchAddressUrl);
  return axios.get(searchAddressUrl)
    .then((res) => {
      console.log('axios response: ', res);
      const addressLabel = _.get(res, 'data.results.0.formatted_address');
      if (!_.isEmpty(addressLabel)) {
        return Promise.resolve(addressLabel);
      }
      return Promise.reject(new Error(`could not locate the address at the coordinates ${latitude}, ${longitude}`));
    });
};

module.exports = {
  getAddressFromLatLon,
};
