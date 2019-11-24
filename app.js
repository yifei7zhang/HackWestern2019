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
/*
async function loadData(){
  await rp('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      var data = [];
      for (var i = 0; i<body.length; ++i){
        data.push({"ObjectID": body.features[i].properties.GIS_ID,
                    "score": 1.2,
                    "coordinates": body.features[i].geometry});
      }
      return data;
    }
  });
}

// replace the uri string with your connection string.
const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   else {
    console.log('Connected...');
    const collection = client.db("LondonBridge").collection("StreetLamps");
    // perform actions on the collection object
    // client.close();
    let data = await loadData();
    console.log('database connected!');
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
*/

/*var data = {};
data.format = async function (){
  await rp('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      for (var i = 0; i < body.length; ++i){
        data.push({"ObjectID": body.features[i].properties.GIS_ID,
                  "score": 1.2,
                  "coordinates": body.features[i].geometry});
      }
      return body
    }
  });
}
*/
const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   else {
    console.log('Connected...');
    const collection = client.db("LondonBridge").collection("StreetLamps");
    // perform actions on the collection object
    
    console.log('database connected!');

    console.log("Loading data");
    request('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    else {

      console.log('Entering db');

      collection.insertMany(body.features, (err, result) => {
        if(err) {
            console.log(err);
            process.exit(0);
        }
        console.log(result);
        client.close();
        });
    }
    });

  }
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
// Grab API data for streetlights functions
async function loadLight(){
  await rp('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {

      console.log('printing now');
      return body;
    }
  });
}

async function loadEmergency(){
  await rp('https://opendata.arcgis.com/datasets/174ed0d5be31424dab612268db1fc460_1.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      return body;
    }
  });
}
async function loadHospitals(){
  await rp('https://opendata.arcgis.com/datasets/a1ca22a405fe4ad9852477a7add40565_2.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      return body;
    }
  });
}

async function loadSchools(){
  await rp('https://opendata.arcgis.com/datasets/cabb026f825348ae9c606f2c8b013e21_4.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      return body;
    }
  });
}

async function loadPaths(){
  await rp('https://opendata.arcgis.com/datasets/a1c044cbeb5c4030909764177cd35a26_2.geojson', { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
    }
    else {
      return body;
    }
  });
}

async function loadAll(){

  console.log('starting in loadall')
  var lightArray = await loadLight();
  console.log('ending in loadall')
  var eServiceArray = await loadEmergency();
  var hospitalArray = await loadHospitals();
  var schoolArray = await loadSchools();
  var pathArray = await loadPaths();
  //var multipliers = setBaseMultipliers(lightArray, eServiceArray, hospitalArray, schoolArray, pathArray);
}

async function setBaseMultipliers(lightArray, eServiceArray, hospitalArray, schoolArray, pathArray){
  var xCoord, yCoord;
  /*for (int i = 0; i < lightArray.length; ++i){
    xCoord = lightArray.features[i].geometry;
    console.log(xCoord);
    
  }*/
}


/*console.log("begin")
loadLight().then((res) => console.log(res));
console.log('end')*/


request('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    response = body;
    // for (var thing in body.features) {
    //   console.log(thing);
    //   console.log(body.features[thing].properties);
    //   console.log(body.features[thing].geometry);
    // }
  }

});

utilities.getGID({ 'x': -81.31660129950282, "y": 43.021370992093786 });
utilities.getNeighbours(52707, { 'x': -81.31660129950282, "y": 43.021370992093786 })
//utilities.getStreet([ -81.31660129950282, 43.021370992093786 ]);

