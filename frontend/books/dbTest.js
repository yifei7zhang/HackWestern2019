// window.onload = getExif;

const express = require('express');

const router = express.Router();

router.get('/[0-9]*', (req, res, next) => {
  console.log('HERE');
  var requestURL = window.location.href;
  var img1 = document.getElementById('preview');
  var img = img1.src;
  EXIF.getData(img1, function() {
    var lat = '' + EXIF.getTag(this, 'GPSLatitude');
    var lon = '' + EXIF.getTag(this, 'GPSLongitude');
    console.log('lat is ' + lat + ' and lon is ' + lon);
    var latDMS = lat.split(',');
    var latD = latDMS[0];
    var latM = latDMS[1];
    var latS = latDMS[2];
    var latitude =
      parseFloat(latD) + parseFloat(latM) / 60 + parseFloat(latS) / 3600;
    var lonDMS = lon.split(',');
    var lonD = lonDMS[0];
    var lonM = lonDMS[1];
    var lonS = lonDMS[2];
    var longitude =
      -1 * (parseFloat(lonD) + parseFloat(lonM) / 60 + parseFloat(lonS) / 3600);
    console.log(latitude);
    console.log(longitude);
    console.log(img);
    console.log(requestURL);
    var data = {
      longitude: longitude,
      latitude: latitude,
      img: img,
      requestURL: requestURL,
    };
    console.log(data);
    var unique = require('uniq');
    const uri =
      'mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority';
    const MongoClient = require(['mongodb']).MongoClient;
    MongoClient.connect(uri, function(err, client) {
      if (err) {
        console.log(
          'Error occurred while connecting to MongoDB Atlas...\n',
          err
        );
      } else {
        console.log('Connected...');
        collection.insertMany(data, (err, result) => {
          if (err) {
            console.log(err);
            process.exit(0);
          }
          console.log(result);
          client.close();
        });
      }
    });
  });
});

module.exports = router;
