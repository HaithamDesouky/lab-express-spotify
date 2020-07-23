require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body.access_token))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/artist-search', (req, res) => {
  const term = req.query.term;
  spotifyApi
    .searchArtists(term)
    .then(data => {
      const items = data.body.artists.items;
      console.log(items[0].images);
      res.render('artist-search-results', { items });
    })
    .catch(err => console.log('Error whie searching artists occured: ', err));
});

app.get('/albums/:id', (req, res, next) => {
  console.log('albums working');

  const id = req.params.id;
  console.log(id);

  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      const album = data.body.items;
      res.render('albums', { album });
    })
    .catch(err => console.log('error while getting album: ', err));
});

app.get('/tracks/:id', (req, res, next) => {
  console.log('tracks working');
  const id = req.params.id;
  console.log(id);
  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      const tracks = data.body;
      console.log(tracks);
      // console.log(album.artists[0]);
      res.render('tracks', { tracks });
    })
    .catch(err => console.log('error while getting tracks'));
});

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
