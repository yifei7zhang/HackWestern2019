const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');


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


// replace the uri string with your connection string.
const uri = "mongodb+srv://LondonBridge:isFallingDown@cluster0-yen05.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});


request('https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Transportation/MapServer/19/query?where=1%3D1&outFields=*&outSR=4326&f=json', { json: true }, (err, res, body) => {
  if (err) { 
    return console.log(err); 
  }
  else {
    for (var thing in body.features) {
      console.log(body.features[thing].geometry);
    }
    // console.log(JSON.parse(body));
  }
  
  
});