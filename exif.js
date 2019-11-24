var getExif = async function () {
    
const readExif = require('read-exif');

(async () => {
  const exif = (await readExif('1574589634362sample.jpg')).Exif;

  // 34855: ID of the `ISOSpeedRatings` tag
  exif['33434']; //=> 250

  // 36868: ID of the `DateTimeDigitized` tag
  exif['36867']; //=> '2018:06:03 08:49:11'
  console.log(exif);
})();
}

module.exports = getExif;