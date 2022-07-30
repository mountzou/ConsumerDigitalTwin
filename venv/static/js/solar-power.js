$(document).ready(function() {

    var attr_solar_list = document.querySelector('script[data-solar]');
    var data_solar_list = attr_solar_list.getAttribute('data-solar');

    const list_of_solar = JSON.parse(data_solar_list);

    var timestamps = []
    var outdoor_temperature = []
    var outdoor_wind_speed = []
    var outdoor_plane_of_irradiance = []

    list_of_solar.forEach(element => {
        outdoor_temperature.push(element[5] + 15);
        timestamps.push(element[1]);
        outdoor_plane_of_irradiance.push(element[4] + 30);
        outdoor_wind_speed.push(element[3]);
    });

    var graphSolarPower = $("#bar-solar-power");
    var graphSolarTemp = $("#bar-temp-power");
    var graphSolarWind = $("#bar-wind-power");
    var graphSolarPoa = $("#bar-poa-power");

    var forecast_dates = ['2022-06-25', '2022-06-26', '2022-06-27', '2022-06-28', '2022-06-29', '2022-06-30', '2022-07-01', '2022-07-03', '2022-07-04', '2022-07-05', '2022-07-06', '2022-07-07', '2022-07-08', '2022-07-09', '2022-07-10'];
    var forecast_dates_environmental = ['2022-06-25', '2022-06-26', '2022-06-27', '2022-06-28', '2022-06-29', '2022-06-30', '2022-07-01', '2022-07-03', '2022-07-04', '2022-07-05'];

    var outdoor_temperature_data = {
        labels: forecast_dates_environmental,
        datasets: [{
            label: "Mean Temperature per Day",
            type: "line",
            borderColor: "rgb(127, 221, 98)",
            backgroundColor: "rgb(127, 221, 98, .1)",
            borderWidth: 2,
            data: outdoor_temperature,
        }]
    };

    var outdoor_wind_speed_data = {
        labels: forecast_dates_environmental,
        datasets: [{
            label: "Mean Wind Speed per Day",
            type: "line",
            borderColor: "rgb(127, 221, 98)",
            backgroundColor: "rgb(127, 221, 98, .1)",
            borderWidth: 2,
            data: outdoor_wind_speed,
        }]
    };

    var outdoor_plane_of_irradiance_data = {
        labels: forecast_dates_environmental,
        datasets: [{
            label: "Plane of Array Irradiance per Day",
            type: "line",
            borderColor: "rgb(127, 221, 98)",
            backgroundColor: "rgb(127, 221, 98, .1)",
            borderWidth: 2,
            data: outdoor_plane_of_irradiance,
        }]
    };

    var barGraph = new Chart(graphSolarPoa, {
        type: 'line',
        data: outdoor_plane_of_irradiance_data,
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
                            return value + ' W/m2';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Plane of Array Irradiance",
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
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return 'Plane of Array Irradiance per Day: ' + tooltipItems.yLabel + ' W/m2';
                    },
                }
            },
        }
    });

    var barGraph = new Chart(graphSolarWind, {
        type: 'line',
        data: outdoor_wind_speed_data,
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
                            return value + ' m/s';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Wind Speed",
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
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return 'Wind Speed: ' + tooltipItems.yLabel + ' m/s';
                    },
                }
            },
        }
    });

    var barGraph = new Chart(graphSolarTemp, {
        type: 'line',
        data: outdoor_temperature_data,
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
                        maxTicksLimit: 4,
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value + ' °C';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Ambient Temperature",
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
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return 'Energy Production: ' + tooltipItems.yLabel + ' °C';
                    },
                }
            },
        }
    });

    var solarData = {
        labels: forecast_dates,
        datasets: [{
                label: "Energy Production per Day",
                type: "line",
                borderColor: "rgb(255, 186, 77)",
                backgroundColor: "rgb(255, 186, 77, .1)",
                borderWidth: 2,
                data: [{
                        x: "2022-06-25",
                        y: 8.7
                    },
                    {
                        x: "2022-06-26",
                        y: 9.2
                    },
                    {
                        x: "2022-06-27",
                        y: 10.7
                    },
                    {
                        x: "2022-06-28",
                        y: 11.2
                    },
                    {
                        x: "2022-06-29",
                        y: 10.3
                    },
                    {
                        x: "2022-06-30",
                        y: 9.8
                    },
                    {
                        x: "2022-07-01",
                        y: 12.2
                    },
                    {
                        x: "2022-07-02",
                        y: 10.1
                    },
                ],
            },
            {
                label: "Forecast of Energy Production per Day",
                type: "line",
                borderColor: "rgb(127, 221, 98)",
                backgroundColor: "rgb(127, 221, 98, .1)",
                borderWidth: 2,
                data: [{
                        x: "2022-07-03",
                        y: 8.7
                    },
                    {
                        x: "2022-07-04",
                        y: 9.2
                    },
                    {
                        x: "2022-07-05",
                        y: 10.7
                    },
                    {
                        x: "2022-07-06",
                        y: 11.2
                    },
                    {
                        x: "2022-07-07",
                        y: 10.3
                    },
                    {
                        x: "2022-07-08",
                        y: 9.8
                    },
                    {
                        x: "2022-07-09",
                        y: 12.2
                    },
                    {
                        x: "2022-07-10",
                        y: 10.1
                    },
                ]
            }
        ]
    };

    var barGraph = new Chart(graphSolarPower, {
        type: 'line',
        data: solarData,
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
                        callback: function(value, index, values) {
                            return value + ' kWh';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Energy Production",
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
            legend: {
                onClick: (e) => e.stopPropagation(),
                labels: {
                    fontSize: 14,
                    usePointStyle: true,
                    boxWidth: 6
                }
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return 'Energy Production: ' + tooltipItems.yLabel + ' kWh';
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