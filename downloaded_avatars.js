var request = require('request');
var fs = require('fs');
var GITHUB_USER = "moogsG";
var GITHUB_TOKEN = "ee33c2e1000e6db8b1c68756fa90a9c7dbb0c374";

console.log('Welcome to the GitHub Avatar Downloader!');
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'moogsG'
    }
  };
  console.log(requestURL);
  request.get(options)
    .on('error', function(err){
      throw err;
    })
    .on('response', function(response){
      console.log('Response Status Code: ', response.statusCode);
      console.log('Response Message: ', response.statusMessage);
      console.log('Response Content Type: ', response.headers['content-type']);
    })
  .pipe(fs.createWriteStream('./tmp/tmp.json'));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
