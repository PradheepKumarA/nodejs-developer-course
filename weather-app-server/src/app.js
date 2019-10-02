const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.static(publicPath));
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
    res.render('index', {
        name: 'Pradheep Kumar',
        title: 'Home'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        name: 'Pradheep Kumar',
        title: 'About'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        name: 'Pradheep Kumar',
        title: 'Help',
        helptext: 'Help Documents!!!!!!'
    })
});

app.get('/weather', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Provide search param'
        });
    }
    geocode(req.query.search, (error, { latitude, longitude, place } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, { temperature, precipProbability } = {}) => {
            if (error) {
                return res.send({
                    error
                });
            }
            res.send({
                place,
                forcast: 'It is curently ' + temperature + '. There are ' + precipProbability + '% chance of rain'
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.send('help not available')
});

app.get('/*', (req, res) => {
    res.send('404')
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
