var request = require('request'); //Set Global Vars
require('dotenv').config();
var fs = require('fs');
var args = process.argv.slice(2);
var error = false;
var fileEXT = '';

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://' + process.env.DB_GITHUB_USER + ':' + process.env.DB_GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var obj = '';
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': process.env.DB_GITHUB_USER //User agent for header
    }
  };

  request.get(options)
      .on('error', function(err) {
      console.log('error:', err);
    })
    .on('response', function(response) { // GET response, set encoding to utf8
      response.setEncoding('utf8');
      error = response.statusCode;
      if (error = 404) {
        error = 'Repo not found ' + response.statusCode;
        return error;
      }else{
        error = false;
        console.log('Repo Found!');
      }

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
  var stream = request.get(url) //Starts get request for img
    .on('error', function(err) {
     console.log('error:', err);
    })
    .on('response', function(response) { // GET response, set encoding to utf8
      response.setEncoding('utf8');
      fileEXT = response.headers['content-type']; //Grabs file type
      fileEXT = Array.from(fileEXT.split('/'));
      stream.pipe(fs.createWriteStream('./avatars/' + filePath + '.' + fileEXT)); //Starts write stream to avatar folder, and creates file.
    })
};

function checkArgs(args) { //validates arguments
  if (args.length === 2) {
    console.log('Taking aguments and looking for repo..');
    var owner = process.argv[2];
    var repo = process.argv[3];
    getRepoContributors(owner, repo, function(err, result, path) { // Takes two arguments from terminal, sends callback as well.
      if(error){
        if(fs.existsSync('./avatars/')){
          console.log('Downloading Avatars...');
          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              downloadImageByURL(result[key]['avatar_url'], result[key]['login']); //sends avatar URL and login to downloadIMG function
            }
          }
        }else {
          console.log('Output folder not found!');
        }
      }else {
        console.log(error);
      }
    });
  }
}


checkArgs(args); //Runs app