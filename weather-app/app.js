const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const address = process.argv[2];

if (address) {
    geocode(address, (error, { latitude, longitude, place }) => {
        if (error) {
            console.log('geocode error : ' + error);
        } else {
            forecast(latitude, longitude, (error, { temperature, precipProbability }) => {
                if (error) {
                    console.log('forecast error : ' + error);
                } else {
                    console.log('Location : ' + place);
                    console.log('It is curently ' + temperature + '. There are ' + precipProbability + '% chance of rain');
                }
            });
        }
    });
} else {
    console.log('provide location')
}

