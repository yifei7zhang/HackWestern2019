var request = require('request');

var utilities = {};

utilities.getStreet = function (coordinates){
    return new Promise(function(resolve, reject) {
        var url = `https://maps.london.ca/arcgisa/rest/services/Locators/ADDRESSMASTER_AddressOnlyLocator/GeocodeServer/reverseGeocode?location={"x":${coordinates.x},"y":${coordinates.y},"spatialReference":{"wkid":4326}}&distance=1000&outSR=4326&returnIntersection=false&f=json`;
        
        try {
            request.get(url, function(error, response, body) {
                var thing = JSON.parse(body);
                var ans = thing.address.Street.replace(/^[0-9]*\s/g,'');
                return resolve(ans);
                
            });
        } catch (e) {
            console.log(e);
            return reject(url);
        }
    });
}

utilities.getNeighbours = function (GID, coordinates){
    return new Promise(async function(resolve, reject) {
        var street = await utilities.getStreet(coordinates);
        
        var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Transportation/MapServer/19/query?geometry=${coordinates.x}%2C${coordinates.y}&inSR=4326&outSR=4326&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelContains&outFields=*&returnGeometry=true&f=json&distance=100&units=esriSRUnit_Meter`;
        var ans = [];
        try {
            request.get(url, async function(error, response, body) {
                var res = JSON.parse(body);
                for (var i in res.features){
                    var neighbourCoord = res.features[i].geometry;
                    var neighbourID = res.features[i].attributes.GIS_ID;
                    var neighbourStreet = await utilities.getStreet(neighbourCoord);
                    if (neighbourStreet == street && neighbourID != GID) {
                        ans.push(neighbourID); 
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

utilities.getGID = function (coordinates){
    return new Promise(async function(resolve, reject) {
        var url = `https://maps.london.ca/arcgisa/rest/services/OpenData/OpenData_Transportation/MapServer/19/query?geometry=${coordinates.x}%2C${coordinates.y}&inSR=4326&outSR=4326&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelContains&outFields=*&returnGeometry=true&f=json`;
        try {
            request.get(url, async function(error, response, body) {
                var res = JSON.parse(body);
                var ans = res.features[0].attributes.GIS_ID;
                return resolve(ans);
            });
        } catch (e) {
            console.log(e);
            return reject(url);
        }
    });
}

module.exports = utilities;