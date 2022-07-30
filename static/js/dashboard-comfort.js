$(document).ready(function() {

    var attr_env_list = document.querySelector('script[data-env-list]');
    var data_env_list = attr_env_list.getAttribute('data-env-list');

    const list_of_indoor_environment = JSON.parse(data_env_list);

    var timestamps = []
    var indoor_temperature = []
    var indoor_humidity = []

    list_of_indoor_environment.forEach(element => {
        indoor_temperature.push(element[0]);
        indoor_humidity.push(element[1]);
        timestamps.push(element[2]);
    });


    var meteoIndoorTemperatureData = {
        labels: timestamps,
        datasets: [{
            label: "Indoor Temperature",
            type: "line",
            borderColor: "#ffba4d",
            backgroundColor: "#ffba4d",
            borderWidth: 2,
            data: indoor_temperature,
            fill: false
        }]
    };

    var meteoIndoorHumidityData = {
        labels: timestamps,
        datasets: [{
            label: "Indoor Humidity",
            type: "line",
            borderColor: "#7fdd62",
            backgroundColor: "#7fdd62",
            borderWidth: 2,
            data: indoor_humidity,
            fill: false
        }]
    };

    var meteoComfortLevelData = {
        labels: ["Thermal Comfort Level", "Thermal Comfort Level Supplument"],
        datasets: [{
            label: "Thermal Comfort",
            data: [82, 18],
            backgroundColor: [
                "#ffba4d",
                "#EEEEEE",
            ]
        }]
    };

    var graphTargetIndoorTemperature = $("#meteo-indoor-temperature");
    var graphTargetIndoorHumidity = $("#meteo-indoor-humidity");
    var graphTargetComfortLevel = $("#dashboard-thermal-comfort");

    var barGraph = new Chart(graphTargetIndoorTemperature, {
        type: 'line',
        data: meteoIndoorTemperatureData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 12,
                        fontFamily: "Josefin Sans",
                        beginAtZero: false,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        callback: function(value, index, values) {
                            return value + " °C";
                        },
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawOnChartArea: true
                    },
                    ticks: {
                        display: false,
                    }
                }],
            },
            legend: {
                onClick: function(e) {
                    e.stopPropagation();
                }
            },
            tooltips: {
                enabled: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        return 'Time: ' + tooltipItems[0].xLabel;
                    },
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + ' °C';
                    },
                }
            },
        }
    });

    var barGraph = new Chart(graphTargetIndoorHumidity, {
        type: 'line',
        data: meteoIndoorHumidityData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 12,
                        fontFamily: "Josefin Sans",
                        beginAtZero: false,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        callback: function(value, index, values) {
                            return value + " %";
                        },
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawOnChartArea: true
                    },
                    ticks: {
                        display: false,
                    }
                }],
            },
            legend: {
                onClick: function(e) {
                    e.stopPropagation();
                }
            },
            tooltips: {
                enabled: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        return 'Time: ' + tooltipItems[0].xLabel;
                    },
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + ' %';
                    },
                }
            },
        }
    });

    var barGraph = new Chart(graphTargetComfortLevel, {
        type: 'doughnut',
        data: meteoComfortLevelData,
        options: {
            elements: {
                arc: {
                    roundedCornersFor: 0
                }
            }
        }
    });

});