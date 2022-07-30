$(document).ready(function () {

    showActivityLevel();

  });

  function showActivityLevel()
  {
    {
      $.post("get_activity_level.php",
      function (data)
        {
          var meta = barGraph && barGraph.data && barGraph.data.datasets[0]._meta;
          for (let i in meta) {
             if (meta[i].controller) meta[i].controller.chart.destroy();
          }

          var daily_activity_level = [];

          for (var i in data[3]) {
            daily_activity_level.push(data[3][i]);
          }

          var activityLevelData = {
              labels: ["Resting","Desk Working","Walking / Housework / House chores","Home Exercise - Moderate Effort","Home Exercise - High Effort"],
              datasets: [
                  {
                    label: "Activity Level",
                    type: "horizontalBar",
                    backgroundColor: ["rgba(255, 200, 77, 0.2)","rgba(255, 177, 77, 0.2)","rgba(255, 163, 77, 0.2)","rgba(255, 99, 77, 0.2)","rgba(255, 32, 77, 0.2)"],
                    borderColor: ["rgba(255, 200, 77, 1.0)","rgba(255, 177, 77, 1.0)","rgba(255, 163, 77, 1.0)","rgba(255, 99, 77, 1.0)","rgba(255, 32, 77, 1.0)"],
                    data: daily_activity_level,
                    borderWidth: 1
                  },
              ]
          };

          $("#bar-activity-level-history").remove();

          $("#chart1").append('<canvas id="bar-activity-level-history" width="800" height="350"></canvas>');

          var graphTargetActivity = $("#bar-activity-level-history");

          var barGraph = new Chart(graphTargetActivity, {
              type: 'horizontalBar',
              data: activityLevelData,
              options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                          display: false,
                          drawOnChartArea: true
                        },
                        scaleLabel: {
                          display: true,
                          labelString: "Percentage of total activity",
                          fontStyle: "bold"
                        },
                        ticks: {
                            padding: 10,
                            autoSkip: true,
                            maxTicksLimit: 10,
                            maxRotation: 0,
                            minRotation: 0,
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value + ' %';
                            }
                        }
                    }],
                    yAxes: [{
                      scaleLabel: {
                        padding: 10,
                        display: true,
                        labelString: "Activity Type",
                        fontStyle: "bold"
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
                      return ' Activity: ' + tooltipItems.xLabel + ' %';
                    }
                  }
                },
              }
          });

        });

      }
  }

  Chart.defaults.global.animation.duration = 0;

  Chart.plugins.register({
    beforeDraw: function(c) {
       var legends = c.legend.legendItems;
       legends.forEach(function(e) {
          e.fillStyle = 'rgba(234, 238, 241, 0.2)';
          e.strokeStyle = "#38414a"
       });
    }
 });
