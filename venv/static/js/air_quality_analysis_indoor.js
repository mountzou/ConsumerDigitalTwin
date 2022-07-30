$(document).ready(function() {

  showGraphCO2();
  showGraphTVOC();

});

function showGraphCO2() {
  {
    $.post("indoor_air_quality_calculate.php",
      function(data) {

        var daily_tco2_mean = data[4];

        var co2Data = {
          labels: data[2].reverse(),
          datasets: [
            {
              label: "Acceptable IAQ conditions",
              type: "line",
              borderColor: "rgb(214, 28, 78, 0.3)",
              backgroundColor: "rgb(214, 28, 78, .1)",
              borderWidth: 2,
              data: Array(data[0].length).fill(800),
              fill: -1,
              pointRadius: 0,
              pointHoverRadius: 0,
              pointHitRadius: 0,
            },
            {
              label: "Fresh IAQ conditions",
              type: "line",
              borderColor: "rgb(255, 186, 77)",
              backgroundColor: "rgb(255, 186, 77, .1)",
              borderWidth: 2,
              data: Array(data[0].length).fill(200),
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
              pointHitRadius: 0,
            },
            {
              label: "Indoor CO2 Level",
              type: "line",
              borderColor: "rgb(127, 221, 98)",
              backgroundColor: "rgb(127, 221, 98, .1)",
              borderWidth: 2,
              data: data[0].reverse(),
              fill: 1,
              pointRadius: 0,
              pointHoverRadius: 0,
              pointHitRadius: 0,
            }
        ]
        };

        var graphTargetco2 = $("#line-chart-co2");

        var barGraph = new Chart(graphTargetco2, {
          type: 'line',
          data: co2Data,
          options: {
            elements: {
              point: {
                radius: 1.4
              }
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: true,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' ppm';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor CO2 Levels",
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
                  maxTicksLimit: 10,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Time",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            tooltips: {
              enabled: true,
              mode: 'single',
              callbacks: {
                label: function(tooltipItems, data) {
                  return 'CO2: ' + tooltipItems.yLabel + ' ppm';
                },
              }
            },
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

        var tvocData = {
          labels: daily_timestamp,
          datasets: [{
            label: "Indoor TVOCs Level",
            type: "line",
            borderColor: "rgb(255, 186, 77)",
            backgroundColor: "rgb(255, 186, 77, .1)",
            borderWidth: 2,
            data: data[1].reverse(),
          }]
        };

        // $("#mean-tvoc").html(daily_tvoc_mean);

        var graphTVOCs = $("#line-chart-tvocs");

        var barGraph = new Chart(graphTVOCs, {
          type: 'line',
          data: tvocData,
          options: {
            elements: {
              point: {
                radius: 1.4
              }
            },
            legend: {
              onClick: (e) => e.stopPropagation(),
              labels: {
                fontSize: 14,
                usePointStyle: true,
                boxWidth: 6
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  padding: 20,
                  fontSize: 13,
                  beginAtZero: true,
                  maxTicksLimit: 4,
                  callback: function(value, index, values) {
                    return value + ' ppb';
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Indoor TVOCs Levels",
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
                  maxTicksLimit: 10,
                  maxRotation: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Time",
                  fontStyle: "bold",
                  fontSize: 14
                }
              }],
            },
            tooltips: {
              enabled: true,
              mode: 'single',
              callbacks: {
                label: function(tooltipItems, data) {
                  return 'TVOCs: ' + tooltipItems.yLabel + ' ppb';
                },
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
