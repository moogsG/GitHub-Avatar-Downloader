var request = require('request'); //Set Global Vars
require('dotenv').config();
var fs = require('fs');
var args = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://' + process.env.DB_GITHUB_USER + ':' + process.env.DB_GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var error = 'None!';
  var obj = '';
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': process.env.DB_GITHUB_USER //User agent for header
    }
  };

  request.get(options) // starts GET request
    .on('error', function(err) {
      error = err;
    })
    .on('response', function(response) { // GET response, set encoding to utf8
      response.setEncoding('utf8');
      console.log('Found repo, generating avatars..');
    })
    .on('data', function(data) { // Adds all chunks to obj
      obj += data;
    })
    .on('end', function() {
      obj = JSON.parse(obj); // Turns obj into a JSON object
      return cb(error, obj);
    });
}

function downloadImageByURL(url, filePath) {
  request.get(url) //Starts get request for img
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {})

  .pipe(fs.createWriteStream('./avatars/' + filePath)); //Starts write stream to avatar folder, and creates file.
}

function checkArgs(args) { //validates arguments
  if (args.length === 2) {
    console.log('Taking aguments and looking for repo..');
    var owner = process.argv[2];
    var repo = process.argv[3];
    getRepoContributors(owner, repo, function(err, result, path) { // Takes two arguments from terminal, sends callback as well.
      console.log('Downloading Avatars...');
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          downloadImageByURL(result[key]['avatar_url'], result[key]['login']); //sends avatar URL and login to downloadIMG function
        }
      }

      console.log('Success! Images downloaded to "/avatars" !');
      console.log("Errors:", err); // will log errors if this fails

    });

  } else {
    console.log('Error! Wrong number of arguments!');
  }
}


checkArgs(args); //Runs app