var async_update_weather = window.setInterval(function(){

  ajaxRequest = new XMLHttpRequest();

  ajaxRequest.onreadystatechange = function() {

   if(ajaxRequest.readyState == 4) {

      var ajaxDisplayMaxHeartRate = document.getElementById('max-heart-rate');

      var ajaxDisplayMinHeartRate = document.getElementById('min-heart-rate');

      var ajaxDisplayAvgHeartRate = document.getElementById('avg-heart-rate');

      var ajaxDisplayLastHeartRate = document.getElementById('last-heart-rate');

      var ajaxDisplayMaxTimeHeartRate = document.getElementById('max-heart-rate-date');

      var ajaxDisplayMinTimeHeartRate = document.getElementById('min-heart-rate-date');

      var ajaxDisplaYLasTimeHeartRate = document.getElementById('last-heart-rate-date');

      var heart_rate_response = JSON.parse(this.responseText);

      var heart_rate_max = heart_rate_response[0][0];

      var heart_rate_min = heart_rate_response[0][1];

      var heart_rate_avg = heart_rate_response[0][3];

      var heart_rate_last = heart_rate_response[0][2];

      var heart_rate_max_time = heart_rate_response[1][0];

      var heart_rate_min_time = heart_rate_response[1][1];

      var heart_rate_last_time = heart_rate_response[1][2];

      ajaxDisplayMaxHeartRate.innerHTML = heart_rate_max + ' BPM';

      ajaxDisplayMinHeartRate.innerHTML = heart_rate_min + ' BPM';

      ajaxDisplayAvgHeartRate.innerHTML = heart_rate_avg + ' BPM';

      ajaxDisplayLastHeartRate.innerHTML = heart_rate_last + ' BPM';

      ajaxDisplaYLasTimeHeartRate.innerHTML = '<b>Measured at </b>' + heart_rate_last_time;

      ajaxDisplayMaxTimeHeartRate.innerHTML = '<b>Measured at </b>' + heart_rate_max_time;

      ajaxDisplayMinTimeHeartRate.innerHTML = '<b>Measured at </b>' + heart_rate_min_time;

   }

  }

  ajaxRequest.open("GET", "get_heart_rate_stats.php", true);
  ajaxRequest.send(null);

}, 15000);
