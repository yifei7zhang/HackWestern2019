const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');
const rp = require('request-promise');
// const readExif = require('read-exif');

var utilities = require('./utilities');
var photoDownload = require('./photos');
var hello = require('./exif');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });


//// Grab priotity affector data

// Initialize data arrays;
var schoolArray = [];
var emergencyServiceArray = [];
var pathArray = [];

var things = {};

// Get list of schools
async function loadSchools(){
  return new Promise(function(resolve, reject) {
      var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Community/MapServer/4/query?outFields=*&outSR=4326&where=1%3D1&f=JSON`;
      try {
        request.get(url, { json: true }, (err, res, body) => {
          if (err) { 
            return console.log(err); 
          }
          else {
            return resolve(body);
          }
        });
      } catch (e) {
          console.log(e);
          return reject(url);
      }
  });
}

// Get list of hospitals
async function loadHospitals(){
  return new Promise(function(resolve, reject) {
      var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Community/MapServer/2/query?outFields=*&outSR=4326&where=1%3D1&f=JSON`;
      try {
        request.get(url, { json: true }, (err, res, body) => {
          if (err) { 
            return console.log(err); 
          }
          else {
            return resolve(body);
          }
        });
      } catch (e) {
          console.log(e);
          return reject(url);
      }
  });
}

// Get list of emergency
async function loadEmergencyServices(){
  return new Promise(function(resolve, reject) {
      var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Community/MapServer/1/query?outFields=*&outSR=4326&where=1%3D1&f=JSON`;
      try {
        request.get(url, { json: true }, (err, res, body) => {
          if (err) { 
            return console.log(err); 
          }
          else {
            return resolve(body);
          }
        });
      } catch (e) {
          console.log(e);
          return reject(url);
      }
  });
}

/* // Get list of paths
async function loadPaths(){
  return new Promise(function(resolve, reject) {
      var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Recreation/MapServer/2/query?outFields=*&outSR=4326&where=1%3D1&f=JSON`;
      try {
        request.get(url, { json: true }, (err, res, body) => {
          if (err) { 
            return console.log(err); 
          }
          else {
            return resolve(body);
          }
        });
      } catch (e) {
          console.log(e);
          return reject(url);
      }
  });
} */

function getIDs(ans, url){
  return new Promise(async function(resolve, reject) {
    try{
      request.get(url, function(error, response, body) {
        var res = JSON.parse(body);

        for (var i in res.features){
          var lightID = res.features[i].attributes.GIS_ID;
          if (!ans.includes(lightID)){
            ans.push(lightID);
          }
        }
        return resolve(ans);
      });
    } catch (e) {
      console.log(e);
      return reject(url);
    }
  });
}

// Template function that will get IDs of lights near specific affectors, returns a list of light GIS_IDs
function getAffector(id){
  var func;
  if (id == 1){
    func = loadHospitals;
  }
  else if (id == 2){
    func = loadEmergencyServices;
  }
  else if (id == 3){
    func = loadSchools;
  }
  else {
    return;
  }

  return new Promise(async function(resolve, reject) {
    var loAffectors = await func();
    var ans = [];
    try {
      for (var i in loAffectors.features){
        var coordinates = loAffectors.features[i].geometry;
        var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Transportation/MapServer/19/query?geometry=${coordinates.x},${coordinates.y}&inSR=4326&outSR=4326&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelContains&outFields=*&returnGeometry=true&f=json&distance=100&units=esriSRUnit_Meter`;
        ans = await getIDs(ans, url);
      }
      return resolve(ans);

    } catch (e) {
        console.log(e);
        return reject(url);
    }
  });
}

//// Connect to MongoDB and load in default information
const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority";
var setup = true;
MongoClient.connect(uri, { useUnifiedTopology: true },function(err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }

    console.log('Connected...');
    const collection = client.db("LondonBridge").collection("StreetLamps");
    console.log('database connected!');
   
    // FIRST TIME SETUP FOR NEW DATABASE
    if (setup == false) {
        console.log("Loading data");
        var data = [];
        request.get('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, async (err, res, body) => {
        if (err) { 
        return console.log(err); 
        }
        else {
        var hospitalIDMatch = await getAffector(1);
        var emergencyIDMatch = await getAffector(2);
        var schoolIDMatch = await getAffector(3);

        for (var j in body.features) {
            var id = body.features[j].properties.GIS_ID;
            var nearHospital = false;
            var nearEmergency = false;
            var nearSchool = false;

            if (hospitalIDMatch.includes(id)){
            nearHospital = true;
            }
            if (emergencyServiceArray.includes(id)){
            nearEmergency = true;
            }
            if (schoolIDMatch.includes(id)){
            nearSchool = true;    
            }
            
            data.push({"ID": id, "CLASS": body.features[j].properties.RoadClass, "COORDINATE": body.features[j].geometry, 
            "NEARHOSPITAL": nearHospital, "NEAREMERGENCY": nearEmergency, "NEARSCHOOL": nearSchool, "BASEMULTIPLIER": 1, "COUNT": 0});
        }
        console.log('Inserting into db');

        collection.insertMany(data, (err, result) => {
            if(err) {
                console.log(err);
                process.exit(0);
            }
            console.log(result);
            });
        }
        });
    }

    // Download a photo of a lamp post and update the request count
    photoDownload();
    var exif = require( "jpeg-exif");
    
    const filePath = "./1574580460987googletest.jpg";
    const datum = exif.parseSync(filePath);

    var rawLatLong = data.GPSInfo;
    var coordinates = {"x": 0, "y": 0};
    coordinates.x = parseFloat(rawLatLong.GPSLatitude[0] + rawLatLong.GPSLatitude[1] / 60 + rawLatLong.GPSLatitude[2]/3600);
    coordinates.y = -parseFloat(rawLatLong.GPSLongitude[0] + rawLatLong.GPSLongitude[1] / 60 + rawLatLong.GPSLongitude[2]/3600);
    
    utilities.getGID(coordinates)
    .then((GID) => {
        collection.findOne({"ID": GID}, function(err, result) {
            if (err) throw err;
    
            var multiplier = 1;
            multiplier *= (result.NEARHOSPITAL ? 1.1: 1);
            multiplier *= (result.NEAREMERGENCY ? 1.1: 1);
            multiplier *= (result.NEARSCHOOL ? 1.1: 1.4);

            collection.updateOne({"ID": GID}, { $set: {"BASEMULTIPLIER": multiplier, "COUNT": result.COUNT + 1, "MULTIPIER": multiplier * (result.COUNT + 1)}}, function(err, result) {
                console.log("Updated ID " + GID);
                client.close();
            });
        });
    });
});
      
/*
function loadData(){
  return new Promise(async function(resolve, reject) {
      var url = 'https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson';
      var data = [];
      try {
        request(url, { json: true }, (err, res, body) => {
          if (err) { 
              return console.log(err); 
            }
            else {
              for (var i = 0; i < body.length; ++i){
                data.push({"ObjectID": body.features[i].properties.GIS_ID,
                          "score": 1.2,
                          "coordinates": body.features[i].geometry});
              }
              return resolve(data);
            }
          });
      } catch (e) {
          console.log(e);
          return reject(url);
      }
  });
}


 function loadDB (){
  return new Promise(function(resolve, reject) {
    const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority"
    
      try {
        MongoClient.connect(uri, async function(err, client) {
          if(err) {
               console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
          }
          else {
           console.log('Connected...');
           const collection = client.db("LondonBridge").collection("StreetLamps");
           // perform actions on the collection object
           
           console.log("Loading data");
           var data = await loadData();
       
           console.log('database connected!');
           console.log(data);
       
          collection.insertMany(data, (err, result) => {
           if(err) {
               console.log(err);
               process.exit(0);
           }
           console.log(result);
           client.close();
           });
       
         }
       });
      } catch (e) {
          console.log(e);
          return reject(uri);
      }
  });
}

*/

