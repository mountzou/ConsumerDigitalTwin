$(document).ready(function () {

  showGraphTemperature();
  showGraphHumidity();

  setInterval(showGraphTemperature,60000);
  setInterval(showGraphHumidity,60000);

});

function showGraphTemperature()
{
  {
    $.post("outdoor_meteo_calculate.php",
    function (data)
      {
        var meta = barGraph && barGraph.data && barGraph.data.datasets[0]._meta;
        for (let i in meta) {
           if (meta[i].controller) meta[i].controller.chart.destroy();
        }

        var daily_timestamp = [];
        var daily_temperature = [];
        var daily_temperature_feel = [];

        for (var i in data[0]) {
          daily_temperature.push(data[0][i]);
          daily_temperature_feel.push(data[1][i]);
          daily_timestamp.push(data[4][i]);
        }

        daily_temperature.reverse();
        daily_temperature_feel.reverse();
        daily_timestamp.reverse();

        var temperatureData = {
            labels: daily_timestamp,
            datasets: [
                {
                  label: "Temperature",
                  type: "line",
                  borderColor: "rgb(255, 186, 77)",
                  backgroundColor: "rgb(255, 186, 77, .1)",
                  borderWidth: 2,
                  data: daily_temperature,
                  fill: false
                },
                {
                  label: 'Temperature Feel',
                  type: "line",
                  borderColor: "rgb(127, 221, 98)",
                  backgroundColor: "rgb(127, 221, 98, .1)",
                  borderWidth: 2,
                  data: daily_temperature_feel,
                  fill: true
                },
            ]
        };

        $("#bar-temperature-history").remove();

        $("#chart1").append('<canvas id="bar-temperature-history" width="800" height="350"></canvas>');

        var graphTargetTemperature = $("#bar-temperature-history");

        var barGraph = new Chart(graphTargetTemperature, {
            type: 'line',
            data: temperatureData,
            options: {
              scales: {
                  yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: "Temperature",
                        fontStyle: "bold"
                      },
                      ticks: {
                          padding: 10,
                          callback: function(value, index, values) {
                              return value + ' °C';
                          }
                      }
                  }],
                  xAxes: [{
                    gridLines: {
                      display: false,
                      drawOnChartArea: true
                    },
                    ticks: {
                        padding: 10,
                        autoSkip: true,
                        maxTicksLimit: 8,
                        maxRotation: 0,
                        minRotation: 0
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Time",
                      fontStyle: "bold",
                      fontSize: 14
                    }
                }],
                yAxes: [{
                  gridLines: {
                    display: true,
                    drawOnChartArea: true
                  },
                  ticks: {
                      padding: 10,
                      autoSkip: true,
                      maxTicksLimit: 8,
                      maxRotation: 0,
                      minRotation: 0
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Temperature",
                    fontStyle: "bold",
                    fontSize: 14
                  },
                  callback: function(value, index, values) {
                    return value + ' °C';
                  }
              }]
              },
              legend: {
                labels: {
                    fontStyle: 'bold'
                }
              },
              tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                  label: function(tooltipItems, data) {
                    if (tooltipItems.datasetIndex != 1){
                      return ' Temperature: ' + tooltipItems.yLabel + ' °C';
                    }
                    else {
                      return ' Temperature Feel: ' + tooltipItems.yLabel + ' °C';
                    }
                  }
                }
              },
            }
        });

      });

    }
}

function showGraphHumidity()
{
  {
    $.post("outdoor_meteo_calculate.php",
    function (data)
      {
        var daily_timestamp = [];
        var daily_humidity = [];

        for (var i in data[0]) {
          daily_timestamp.push(data[4][i]);
          daily_humidity.push(data[2][i]);
        }

        daily_humidity.reverse();
        daily_timestamp.reverse();

        var temperatureData = {
            labels: daily_timestamp,
            datasets: [
                {
                  label: "Relative Humidity",
                  type: "line",
                  borderColor: "rgb(127, 221, 98)",
                  backgroundColor: "rgb(127, 221, 98, .1)",
                  borderWidth: 2,
                  data: daily_humidity,
                  fill: true
                },
            ]
        };

        $("#bar-humidity-history").remove();

        $("#chart2").append('<canvas id="bar-humidity-history" width="800" height="350"></canvas>');

        var graphHumidity = $("#bar-humidity-history");

        var barGraph = new Chart(graphHumidity, {
            type: 'bar',
            data: temperatureData,
            options: {
              elements: {
                point: {
                  radius: 1.4
                }
              },
              scales: {
                  pointLabels: {
                    fontStyle: "bold",
                  },
                  yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: "Relative Humidity",
                        fontStyle: "bold",
                        fontSize: 14
                      },
                      ticks: {
                          beginAtZero: true,
                          padding: 10,
                          callback: function(value, index, values) {
                              return value + ' %';
                          }
                      }
                  }],
                  xAxes: [{
                    gridLines: {
                      display: false,
                      drawOnChartArea: true
                    },
                    ticks: {
                        padding: 10,
                        autoSkip: true,
                        maxTicksLimit: 8,
                        maxRotation: 0,
                        minRotation: 0
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Time",
                      fontStyle: "bold",
                      fontSize: 14
                    }
                }]
              },
              legend: {
                onClick: (e) => e.stopPropagation(),
                labels: {
                    fontStyle: 'bold'
                }
              },
              tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                  label: function(tooltipItems, data) {
                    return ' Relative Humidity: ' + tooltipItems.yLabel + ' %';
                  }
                }
              },
            }
        });

      });

    }
}

Chart.defaults.global.defaultFontFamily = 'Josefin Sans';

Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 20;
};
