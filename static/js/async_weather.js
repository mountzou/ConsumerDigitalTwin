var async_update_weather = window.setInterval(function(){

  ajaxRequest = new XMLHttpRequest();

  ajaxRequest.onreadystatechange = function() {

   if(ajaxRequest.readyState == 4) {

      var ajaxDisplayTemp = document.getElementById('outdoor-temperaure-value');

      var ajaxDisplayTempFeel = document.getElementById('outdoor-temperaure-feel-value');

      var ajaxDisplayHumidity = document.getElementById('outdoor-humidity-value');

      var weatherArray = ajaxRequest.responseText.split(",");

      var temperatureValue = weatherArray[0] + ' °C';

      var temperatureFeelValue = weatherArray[1] + ' °C';

      var humidityValue = weatherArray[2] + ' %';

      ajaxDisplayTemp.innerHTML = temperatureValue;

      ajaxDisplayTempFeel.innerHTML = temperatureFeelValue;

      ajaxDisplayHumidity.innerHTML = humidityValue;

   }

  }

  ajaxRequest.open("GET", "get_outdoor_async.php?city="+user_city, true);
  ajaxRequest.send(null);

}, 60000);
