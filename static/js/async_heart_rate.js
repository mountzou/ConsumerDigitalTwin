var async_update_weather = window.setInterval(function(){

  ajaxRequest = new XMLHttpRequest();

  ajaxRequest.onreadystatechange = function() {

   if(ajaxRequest.readyState == 4) {

      var ajaxDisplayLastHeartRate = document.getElementById('last-heart-rate-value');

      var heartRateValueResponse = ajaxRequest.responseText;

      console.log(heartRateValueResponse);

      var heartRateValue = heartRateValueResponse + ' BPM';

      ajaxDisplayLastHeartRate.innerHTML = heartRateValue;

   }

  }

  ajaxRequest.open("GET", "get_last_heart_rate.php", true);
  ajaxRequest.send(null);

}, 30000);
