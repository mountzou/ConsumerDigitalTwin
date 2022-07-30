$(document).ready(function() {

  var thermalComfortData = {
    labels: ['11:00', '11:05', "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20","12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55", "13:00"],
    datasets: [{
      label: "Thermal Comfort",
      type: "line",
      borderColor: "rgb(255, 186, 77)",
      backgroundColor: "rgb(255, 186, 77, .1)",
      borderWidth: 2,
      data: [1.2, 1.4, 1.4, 1.7, 1.5, 1.7, 1.5, 1.2, 1.2, 1.2, 1.7, 1.4, 1.0, 0.8, 0.5, 0.2, -0.2, -0.4, 0.2, 0.8, 1.1, 1.0, 1.1, 0.9, 1.1, 1.2],
    }]
  };

  var graphTargetThermalComfort = $("#line-thermal-comfort");

  var barGraph = new Chart(graphTargetThermalComfort, {
    type: 'line',
    data: thermalComfortData,
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
              if (value==1){ return 'Slightly Warm';}
              if (value==0){ return 'Neutral';}
              if (value==-1){ return 'Slightly Cool';}
              if (value==2){ return 'Warm';}
              return value + '';
            },
          },
          scaleLabel: {
            display: true,
            labelString: "Thermal Comfort",
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
            labelString: "Date",
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
            return 'Thermal Comfort: ' + tooltipItems.yLabel + '';
          },
        }
      },
    }
  });

});

Chart.defaults.global.defaultFontFamily = 'Josefin Sans';

Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 20;
};
