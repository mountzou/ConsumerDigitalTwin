var async_update_weather = window.setInterval(function(){

  ajaxRequest = new XMLHttpRequest();

  ajaxRequest.onreadystatechange = function() {

   if(ajaxRequest.readyState == 4) {

      var weatherArray = ajaxRequest.responseText.split(",");

      var temperatureValue = weatherArray[0] + ' °C';

      var temperatureFeelValue = weatherArray[1] + ' °C';

      var humidityValue = weatherArray[2] + ' %';

      var windSpeedValue = weatherArray[3] + ' m/s';

      var timeStampValue = weatherArray[4] ;

      var date = new Date(timeStampValue * 1000);

      var hours = date.getHours();

      var minutes = "0" + date.getMinutes();

      var seconds = "0" + date.getSeconds();

      var formattedTime = hours-2 + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      $('.outdoor-temperature-heading').html(temperatureValue);

      $('.outdoor-temperature-feel-heading').html(temperatureFeelValue);

      $('.outdoor-humidity-heading').html(humidityValue);

      $('.outdoor-wind-speed-heading').html(windSpeedValue);

      $('.outdoor-meteo-time-update').html('Last Updated on: '+ formattedTime);

   }

  }

  ajaxRequest.open("GET", "get_outdoor_async.php?city="+user_city, true);
  ajaxRequest.send(null);

}, 30000);
