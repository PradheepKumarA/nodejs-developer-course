const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/8b8a13012e4249551d9c2b89224c2be8/' + latitude + ',' + longitude + '?units=si';
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Weather service is down!');
        } else if (body.error) {
            callback('Location coordinates is invalid!');
        } else {
            callback(undefined, {
                temperature: body.currently.temperature,
                precipProbability: body.currently.precipProbability
            });
        }
    });
}

module.exports = forecast;
