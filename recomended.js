var getRepoContributors = require('./downloaded_avatars')
arr = [];
getRepoContributors('lighthouse-labs', 'laser_shark', function(err, result){
  for (var key in result) {
    if (result.hasOwnProperty(key)) {
      arr.push(result[key]['starred_url']); //sends avatar URL and login to downloadIMG function
    }
  }
  console.log(arr);
})