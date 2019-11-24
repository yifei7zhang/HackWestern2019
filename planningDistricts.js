var request = require('request');

var planningDistricts = {};

planningDistricts.getDistricts = function () {
    return new Promise(function(resolve, reject) {
        var url = "https://maps.london.ca/arcgisa/rest/services/PlanningDistricts/MapServer/0/query?where=OBJECTID>0&outSR=4326&f=json";
        districtMap = {};

        try {
            request.get(url, function(error, response, body) {
                var res = JSON.parse(body);

                for (var i in res.features) {
                    districtMap[res.features[i].attributes.GIS_FeatureKey] = res.features[i].geometry
                }
                return resolve(districtMap);
            });

        } catch (e) {
            console.log(e);
            return reject(url);
        }
    });
}

planningDistricts.returnDistrict = function(point, districtGeometries) {
    return new Promise(async function(resolve, reject) {
        var pointGeometries = {};
        pointGeometries.geometryType = "esriGeometryPoint";
        pointGeometries.geometries = [point];


        for (var key in districtGeometries) {
            var polygonGeometries = {};
            polygonGeometries.geometryType = "esriGeometryPolygon";
            polygonGeometries.geometries = [districtGeometries[key]];


            res = await planningDistricts.pointInPolygon(pointGeometries, polygonGeometries);
            if (res) return resolve(key);
        }

        return resolve(null);
    });
}

planningDistricts.pointInPolygon = function(point, polygon) {
    return new Promise(function(resolve, reject) {
        var url = `http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer/relation?sr=4326&geometries1=${encodeURIComponent(JSON.stringify(point))}&geometries2=${encodeURIComponent(JSON.stringify(polygon))}&relation=esriGeometryRelationWithin&f=json`;

        try {
            request.get(url, function(error, response, body) {
                var res = JSON.parse(body);

                return resolve(res.relations.length > 0);
            });
        
        } catch (e) {
            console.log(e);
            return reject(url);
        }
    });
}

module.exports = planningDistricts;


/*var np  = planningDistricts.getDistricts()
.then((res) => {
    console.log(res);
    
    point = {"x": -81.29741, "y": 43.02764};
    planningDistricts.returnDistrict(point, res)
    .then((r) => {
        console.log(r);
    });
});
*/

