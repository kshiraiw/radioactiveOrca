

//calculates current time plus transit plus desired leaving time
var calculateTarget = function(transit, leavingTime) {
  var currentTime = new Date().getTime();
  //convert transit time to milliseconds
  return currentTime + (transit * 1000) + leavingTime;
};

//changes showtime into date object
var convertShowTime = function(showtime) {
  var today = new Date();
  //splitting showtime on non numerical characters
  var timeArray = showtime.split(/\D/);
  //if time is in the evening
  if (showtime.indexOf('pm') !== -1 && +timeArray[0] !== 12) {
    today.setHours(+timeArray[0] + 12);
    //if time is midnight
  } else if (showtime.indexOf('am') !== -1 && +timeArray[0] === 12) {
    today.setHours(0);
    today.setDate(today.getDate() + 1);
  } else {
    //change hours to showtime hour
    today.setHours(+timeArray[0]);
  }
  //change minutes to showtime minutes
  today.setMinutes(+timeArray[1]);
  return today.getTime();
};

module.exports = function(theaters, leavingTime) {
  var results = [];
  theaters.forEach(function(theater) {
    var targetTime = calculateTarget(theater.transitTimeSeconds, leavingTime);
    //mintime is target plus 5 minutes
    minTargetTime = targetTime + 300000;
    //maxtime is target plus 35 minutes
    maxTargetTime = targetTime + 2100000;
    theater.movies.forEach(function(movie) {
      movie.showtimes.forEach(function(showtime) {
<<<<<<< HEAD
      var convertedShowTime = convertShowTime(showtime);

        if (minTargetTime <= convertedShowTime && convertedShowTime <= maxTargetTime) {
=======
        var showTime = convertShowTime(showtime);
        //filter for movies within 5 to 35 minutes of target time
        if (minTargetTime <= showTime && showTime <= maxTargetTime) {
>>>>>>> Add ability to choose leaving time and apply leaving time to filter
          //extract imdb id from url
          var imdbArr = movie.imdb.split('/');
          var imdb = imdbArr[imdbArr.length - 2];
          results.push({id: imdb, dateObjectShowTime: convertedShowTime, showTime: showtime, movieName: movie.name, transitTime: theater.transitTime, theaterName: theater.name, imdbLink: movie.imdb, trailerLink: movie.trailer, theaterAddress: theater.address, rating: movie.rating});
        }
      });
    });
  });
  return results;
};

