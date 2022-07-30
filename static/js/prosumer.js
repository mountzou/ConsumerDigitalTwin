$(document).ready(function () {

  showGraphEnergy();

});

function showGraphEnergy()
{
  {
    $.post("paper_prosumer_calculate.php",
    function (data)
      {

        var dateArray = data[0].reverse();
        var prodArray = data[1].reverse();
        var conArray = data[2].reverse();

        var dateArrayAGG = data[3].reverse();
        var prodArrayAGG = data[4].reverse();
        var conArrayAGG = data[5].reverse();

        var date2 = data[6];
        var prod2 = data[7];

        let hvac_consumption = [];
        let boiler_consumption = [];

        for (let i = 0; i < 1100; i++)
        {
          hvac = conArray[i]*Math.random();
          boiler = conArray[i] - hvac;
          hvac_consumption.push(hvac);
          boiler_consumption.push(boiler);
        }

        var energyDataProd = {
            labels: date2,
            datasets: [
                {
                  label: "Energy Production",
                  type: "line",
                  borderColor: "#7fdd62",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: prod2,
                  fill: false
                }
            ]
        };

        var energyDataCon = {
            labels: dateArray,
            datasets: [
                {
                  label: "Energy Consumption",
                  type: "line",
                  borderColor: "#ffba4d",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: conArray,
                  fill: false
                },
                {
                  label: 'Energy Consumption',
                  type: "line",
                  borderColor: "#303956;",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: boiler_consumption,
                  fill: false
                },
                {
                  label: 'Energy Consumption',
                  type: "line",
                  borderColor: "7fdd62",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: hvac_consumption,
                  fill: false
                },
            ]
        };

        var energyDataAGGProd = {
            labels: dateArrayAGG,
            datasets: [
                {
                  label: "Energy Production",
                  type: "bar",
                  borderColor: "#7fdd62",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: prodArrayAGG,
                  fill: false
                }
            ]
        };

        var energyDataAGGCon = {
            labels: dateArrayAGG,
            datasets: [
                {
                  label: 'Energy Consumption',
                  type: "bar",
                  borderColor: "#ffba4d",
                  backgroundColor: "white",
                  borderWidth: 2,
                  data: conArrayAGG,
                  fill: false
                }
            ]
        };

        var graphTargetEnergyProd = $("#dashboard-energy-production");
        var graphTargetEnergyCon = $("#dashboard-energy-consumption");

        var graphTargetEnergyBarProd = $("#bar-energy-prod-bar");
        var graphTargetEnergyBarCon = $("#bar-energy-con-bar");

        var lineGraph = new Chart(graphTargetEnergyProd, {
          data: energyDataProd,
          options: {
            animation: {
              duration: 0
            },
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                ticks: {
                  padding: 12,
                  fontFamily: "Josefin Sans",
                  beginAtZero: false,
                  autoSkip: true,
                  maxTicksLimit: 6,
                  callback: function(value, index, values) {
                    return value + " kWh";
                  },
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: false,
                },
                ticks: {
                  display: false,
                  autoSkip: true,
                  maxTicksLimit: 30
                }
              }],
            },
            tooltips: {
              enabled: false,
              callbacks: {
                title: function(tooltipItems, data) {
                  return 'Time: ' + tooltipItems[0].xLabel;
                },
                label: function(tooltipItems, data) {
                  return tooltipItems.yLabel + ' kWh';
                },
              }
            }
          }
        });

        var lineGraph = new Chart(graphTargetEnergyCon, {
          data: energyDataCon,
          options: {
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                type: 'logarithmic',
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  maxTicksLimit: 5,
                  padding: 12,
                  fontFamily: "Josefin Sans",
                  callback: function(value, index, values) {
                    return value + ' kWh';
                  }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: false,
                },
                ticks: {
                  display: false,
                  autoSkip: true,
                }
              }],
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var legendLabel = data.datasets[tooltipItem.datasetIndex].label;
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' kWh';

                  if (Chart.helpers.isArray(dataLabel)) {
                    dataLabel = dataLabel.slice();
                    dataLabel[0] = value;
                  } else {
                    dataLabel = value;
                  }
                  return dataLabel;
                }
              },
            }
          }
        });

        var lineGraph = new Chart(graphTargetEnergyBarProd, {
          type: 'line',
          data: energyDataAGGProd,
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
                fontColor: '#444444',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontStyle: 'bold'
              }
            },
            scales: {
              yAxes: [{
                type: 'logarithmic',
                scaleLabel: {
                  min: 0,
                  labelString: 'Κρούσματα',
                  fontFamily: 'Roboto',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  maxTicksLimit: 5,
                  callback: function(value, index, values) {
                    return value + ' kWh';
                  }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date',
                  fontFamily: 'Roboto',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  display: (window.innerWidth < 640) ? false : true,
                  autoSkip: true,
                  maxTicksLimit: 30
                }
              }],
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var legendLabel = data.datasets[tooltipItem.datasetIndex].label;
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString()+' kWh';

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
              text: 'Aggregated Daily Energy Production'
            }
          }
        });

        var lineGraph = new Chart(graphTargetEnergyBarCon, {
          type: 'line',
          data: energyDataAGGCon,
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
                fontColor: '#444444',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontStyle: 'bold'
              }
            },
            scales: {
              yAxes: [{
                type: 'logarithmic',
                scaleLabel: {
                  min: 0,
                  labelString: 'Κρούσματα',
                  fontFamily: 'Roboto',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  maxTicksLimit: 5,
                  callback: function(value, index, values) {
                    return value + ' kWh';
                  }
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date',
                  fontFamily: 'Roboto',
                  fontStyle: 'bold',
                  fontSize: 13
                },
                ticks: {
                  display: (window.innerWidth < 640) ? false : true,
                  autoSkip: true,
                  maxTicksLimit: 30
                }
              }],
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var legendLabel = data.datasets[tooltipItem.datasetIndex].label;
                  var dataLabel = data.labels[tooltipItem.index];
                  var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString()+' kWh';

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
              text: 'Aggregated Daily Energy Consumption'
            }
          }
        });

    });

  }
}

Chart.defaults.global.animation.duration = 0;
