$(document).ready(function() {

  showGraphAcoustic();

});

function showGraphAcoustic() {
  {
    $.post("indoor_acoustic_calculate.php",
      function(data) {
        var meta = barGraph && barGraph.data && barGraph.data.datasets[0]._meta;
        for (let i in meta) {
          if (meta[i].controller) meta[i].controller.chart.destroy();
        }

        var daily_timestamp = data[1];
        var daily_acoustic = data[0];
        var daily_acoustic_mean = data[2];

        daily_acoustic.reverse();
        daily_timestamp.reverse();

        var acousticData = {
          labels: daily_timestamp,
          datasets: [{
            label: "Acoustic Level",
            type: "line",
            borderColor: "#ffba4d",
            backgroundColor: "white",
            borderWidth: 2,
            data: daily_acoustic,
            fill: false,
          }]
        };

        $("#bar-acoustic-history").remove();

        $("#chart1").append('<canvas id="bar-acoustic-history" width="800" height="350"></canvas>');

        $("#mean-acoustic").html(daily_acoustic_mean + ' dB');

        var graphTargetAcoustic = $("#bar-acoustic-history");

        var barGraph = new Chart(graphTargetAcoustic, {
          type: 'line',
          data: acousticData,
          options: {
            animation: {
              duration: 0
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                title: {
                  display: true,
                  text: 'Legend Title',
                },
                boxWidth: 10,
                fontColor: '#303956',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontStyle: 'bold'
              }
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'CO2 Level',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  beginAtZero: false,
                  maxTicksLimit: 5,
                  callback: function(value, index, values) {
                    if (parseInt(value) >= 1000) {
                      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } else {
                      return value + ' dB';
                    }
                  }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date / Time',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  display: (window.innerWidth < 640) ? false : true,
                  autoSkip: true,
                  maxTicksLimit: 12,
                  maxRotation: 0,
                  minRotation: 0,
                }
              }],
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var legendLabel = data.datasets[tooltipItem.datasetIndex].label;
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + 'ppm';

                  if (Chart.helpers.isArray(dataLabel)) {
                    dataLabel = dataLabel.slice();
                    dataLabel[0] = value;
                  } else {
                    dataLabel = value;
                  }
                  return dataLabel;
                }
              },
            },
            title: {
              display: true,
              text: 'Data visualization of the latest Acoustic Level values as measured by the Indoor Station.'
            }
          }
        });

      });

  }
}

Chart.defaults.global.animation.duration = 0;
