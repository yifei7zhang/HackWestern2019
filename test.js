const request = require('request');
const rp = require('request-promise');

var xim;
async function dick(){
await rp('https://opendata.arcgis.com/datasets/e2db218c663f4b9f9210150513a6c54a_19.geojson', { json: true }, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    else {
        return body;
    }
});
}

async function fuck(){
    var xim = await dick();

    console.log(xim);
}
fuck();