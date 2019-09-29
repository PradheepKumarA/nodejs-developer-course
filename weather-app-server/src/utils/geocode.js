const request = require('request');

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURI(address) + '.json?access_token=pk.eyJ1IjoicHJhZGhlZXBhcnVsIiwiYSI6ImNrMTNsbnh3OTA5eGUzZHFqeDZyZW80d2YifQ.D7D3e8GKO6qUJuf0wfgj_Q';
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Geo location service is down!');
        } else if (body.features.length === 0) {
            callback('Location is invalid!');
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                place: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;
