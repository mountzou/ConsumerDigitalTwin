$(document).ready(function() {

  showGraphTemperature();
  showGraphHumidity();

  showGraphTVOC();
  showGraphCO2();

});

function showGraphTemperature() {
  {
    $.post("indoor_meteo_calculate.php",
      function(data) {

        var daily_timestamp = data[3];
        var daily_temperature = data[0];
        var daily_temperature_mean = data[4];

        daily_temperature.reverse();
        daily_timestamp.reverse();

        var temperatureData = {
          labels: daily_timestamp,
          datasets: [{
            label: "Indoor Temperature",
            type: "line",
            borderColor: "rgb(255, 186, 77)",
            backgroundColor: "rgb(255, 186, 77, .1)",
            borderWidth: 2,
            data: daily_temperature,
            fill: true,
          }]
        };

        $("#mean-temperature").html(daily_temperature_mean + ' °C');

        var graphTargetTemperature = $("#bar-temperature-history");

        var barGraph = new Chart(graphTargetTemperature, {
          type: 'line',
          data: temperatureData,
          options: {
            elements: {
              point: {
                radius: 0.8
              }
            },
            scales: {
              pointLabels: {
                fontStyle: "bold",
              },
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: false,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' °C';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor Temperature",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  drawOnChartArea: true
                },
                ticks: {
                  fontSize: 13,
                  padding: 20,
                  autoSkip: true,
                  maxTicksLimit: 4,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = 'Indoor Temperature: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' °C';

                  return value;
                }
              },
            }
          }
        });

      });

  }
}

function showGraphHumidity() {
  {
    $.post("indoor_meteo_calculate.php",
      function(data) {

        var daily_timestamp = data[3];
        var daily_humidity = data[1];
        var daily_temperature_mean = data[5];

        daily_timestamp.reverse();
        daily_humidity.reverse();

        var humidityData = {
          labels: daily_timestamp,
          datasets: [{
            label: "Indoor Relative Humidity",
            type: "line",
            borderColor: "rgb(127, 221, 98)",
            backgroundColor: "rgb(127, 221, 98, .1)",
            borderWidth: 2,
            data: daily_humidity,
            fill: true
          }, ]
        };

        $("#mean-humidity").html(daily_temperature_mean + ' %');

        var graphHumidity = $("#bar-humidity-history");

        var barGraph = new Chart(graphHumidity, {
          type: 'line',
          data: humidityData,
          options: {
            elements: {
              point: {
                radius: 0.4
              }
            },
            scales: {
              pointLabels: {
                fontStyle: "bold",
              },
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: false,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' %';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor Relative Humidity",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  drawOnChartArea: true
                },
                ticks: {
                  fontSize: 13,
                  padding: 20,
                  autoSkip: true,
                  maxTicksLimit: 4,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = 'Indoor Relative Humidity: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' %';

                  return value;
                }
              },
            }
          }
        });

      });

  }
}

function showGraphCO2() {
  {
    $.post("indoor_air_quality_calculate.php",
      function(data) {

        var daily_timestamp = data[2];
        var daily_co2 = data[0];
        var daily_tco2_mean = data[4];

        daily_co2.reverse();
        daily_timestamp.reverse();

        var co2Data = {
          labels: daily_timestamp,
          datasets: [{
            label: "CO2 Level",
            type: "line",
            borderColor: "rgb(255, 186, 77)",
            backgroundColor: "rgb(255, 186, 77, .1)",
            borderWidth: 2,
            data: daily_co2,
            fill: true,
          }]
        };

        $("#mean-co2").html(daily_tco2_mean + ' ppm');

        var graphTargetco2 = $("#bar-co2-history");

        var barGraph = new Chart(graphTargetco2, {
          type: 'line',
          data: co2Data,
          options: {
            elements: {
              point: {
                radius: 0.4
              }
            },
            scales: {
              pointLabels: {
                fontStyle: "bold",
              },
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: false,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' ppm';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor CO2 Level",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  drawOnChartArea: true
                },
                ticks: {
                  fontSize: 13,
                  padding: 20,
                  autoSkip: true,
                  maxTicksLimit: 4,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = 'Indoor CO2 Level: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' ppm';

                  return value;
                }
              },
            }
          }
        });

      });

  }
}

function showGraphTVOC() {
  {
    $.post("indoor_air_quality_calculate.php",
      function(data) {

        var daily_timestamp = data[2];
        var daily_tvoc = data[1];
        var daily_tvoc_mean = data[3];

        daily_timestamp.reverse();
        daily_tvoc.reverse();

        var tvocData = {
          labels: daily_timestamp,
          datasets: [{
            label: "TVOCs Level",
            type: "line",
            borderColor: "rgb(127, 221, 98)",
            backgroundColor: "rgb(127, 221, 98, .1)",
            borderWidth: 2,
            data: daily_tvoc,
            fill: true
          }, ]
        };

        var graphTVOCs = $("#bar-tvoc-history");

        var barGraph = new Chart(graphTVOCs, {
          type: 'line',
          data: tvocData,
          options: {
            elements: {
              point: {
                radius: 0.4
              }
            },
            scales: {
              pointLabels: {
                fontStyle: "bold",
              },
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: false,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' ppb';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor TVOCs Level",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  drawOnChartArea: true
                },
                ticks: {
                  fontSize: 13,
                  padding: 20,
                  autoSkip: true,
                  maxTicksLimit: 4,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = 'Indoor TVOCs Level: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' ppb';

                  return value;
                }
              },
            }
          }
        });

      });

  }
}

Chart.defaults.global.defaultFontFamily = 'Josefin Sans';

Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 20;
};
