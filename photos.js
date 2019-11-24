
// Imports the Google Cloud client library

var photoDownload = async function(){
    const {Storage} = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const bucketName = 'london-bridge-photo-upload';
    var varFileName = '1574589634362sample.jpg';
    const destFilename = './1574589634362sample.jpg';

    const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
    };

    // Downloads the file
    await storage
    .bucket(bucketName)
    .file(varFileName)
    .download(options);

    console.log(
    `gs://${bucketName}/${varFileName} downloaded to ${destFilename}.`
    );
}

module.exports = photoDownload;