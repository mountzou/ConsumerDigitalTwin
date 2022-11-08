$(document).ready(function() {

    var attr_hvac_list = document.querySelector('script[data-hvac]');
    var data_hvac_list = attr_hvac_list.getAttribute('data-hvac');

    var attr_hvac_time_list = document.querySelector('script[data-hvac-time]');
    var data_hvac_time_list = attr_hvac_time_list.getAttribute('data-hvac-time').split(',');

    for(var i = 0; i < data_hvac_time_list.length; i++)
{
    data_hvac_time_list[i] = data_hvac_time_list[i].replace("'", "");
}

    for(var i = 0; i < data_hvac_time_list.length; i++)
{
    data_hvac_time_list[i] = data_hvac_time_list[i].replace("'", "");
}

    const hvac_values = data_hvac_list.slice(-72);

    const hvac_time = data_hvac_time_list.slice(-72);

new Chart(document.getElementById("air-condition"), {
    type: 'line',
    data: {
      labels: hvac_time,
      datasets: [
        {
          label: "HVAC | Hourly Energy Consumption",
            borderColor: "rgb(255, 186, 77)",
            backgroundColor: "rgb(255, 186, 77, .1)",
            borderWidth: 2,
            fill: false,
            data: hvac_values
        }
      ]
    },
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
                    ticks: {
                        padding: 20,
                        fontSize: 13,
                        beginAtZero: true,
                        maxTicksLimit: 4,
                        callback: function(value, index, values) {
                            return value + ' kWh';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Energy Consumption (kWh)",
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
                enabled: false,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return 'Energy Consumption: ' + tooltipItems.yLabel + ' kWh';
                    },
                }
            },
        }
});
})

Chart.defaults.global.defaultFontFamily = 'Josefin Sans';