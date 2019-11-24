const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');
const rp = require('request-promise');

var utilities = require('./utilities');


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
 
const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, { useUnifiedTopology: true },function(err, client) {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }

    console.log('Connected...');
    const collection = client.db("LondonBridge").collection("StreetLamps");
    // perform actions on the collection object
    
    console.log('database connected!');
   /*else {
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
        "NEARHOSPITAL": nearHospital, "NEAREMERGENCY": nearEmergency, "NEARSCHOOL": nearSchool, "BASEMULTIPLIER": 0, "COUNT": 0});
      }
      console.log('Entering db');

      collection.insertMany(data, (err, result) => {
        if(err) {
            console.log(err);
            process.exit(0);
        }
        console.log(result);
        });
    }
    });*/

    /*collection.updateMany({}, { $set: {"BASEMULTIPLIER": 1}}, function(err, result) {
        if (err) throw err;
        console.log("Added multipliers");
    });*/

    // Insert code to pass in coordinates
    var coordinates = {"x":-81.2651,"y":43.0078693};
    utilities.getGID(coordinates)
    .then((GID) => {
        collection.findOne({"ID": GID}, function(err, result) {
            if (err) throw err;
            console.log(result);
    
            var multiplier = 1;
            multiplier *= (result.NEARHOSPITAL ? 1.1: 1);
            multiplier *= (result.NEAREMERGENCY ? 1.1: 1);
            multiplier *= (result.NEARSCHOOL ? 1.1: 1.4);

            console.log(multiplier);

            collection.updateOne({"ID": GID}, { $set: {"BASEMULTIPLIER": multiplier}}, function(err, result) {
                console.log("Updated ID " + GID);
                client.close();
            });
        });
    });
});
      


//multiplier = (1.1 * ()) * (1.1 * ()) * (1.1 *());

//collection.update({"ID": GID}, { $set: {"BASEMULTIPLIER": }})



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
          return reject(url); // something fucked up
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
          return reject(uri); // something fucked up
      }
  });
}

*/
// Grab JSON from API to get data on locations of street lights
// Original base code format
/* async function loadLight(){
  await rp('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      return body;
    }
  });
 */


/* utilities.getGID({ 'x': -81.31660129950282, "y": 43.021370992093786 });
utilities.getNeighbours(52707, { 'x': -81.31660129950282, "y": 43.021370992093786 }) */
//utilities.getStreet([ -81.31660129950282, 43.021370992093786 ]);




// ----------------------------------------------- A fat load of shit -----------------------------------------------
/* 
// Grab locations for emergency services
request('https://opendata.arcgis.com/datasets/174ed0d5be31424dab612268db1fc460_1.geojson', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    for (var i = 0; i < body.features.length; ++i){
      emergencyServiceArray.push(body.features[i].geometry);
    }
  }
});

// Grab locations for hospitals
request('https://opendata.arcgis.com/datasets/a1ca22a405fe4ad9852477a7add40565_2.geojson', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    for (var i = 0; i < body.features.length; ++i){
      hospitalArray.push(body.features[i].geometry);
    }
  }
});

// Grab locations for schools
request('https://opendata.arcgis.com/datasets/cabb026f825348ae9c606f2c8b013e21_4.geojson', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    for (var i = 0; i < body.features.length; ++i){
      schoolArray.push(body.features[i].geometry);
    }
  }
});

// Grab locations for paths
request('https://opendata.arcgis.com/datasets/a1c044cbeb5c4030909764177cd35a26_2.geojson', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    for (var i = 0; i < body.features.length; ++i){
      pathArray.push(body.features[i].geometry);
    }
  }
}); */