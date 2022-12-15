$(document).ready(function() {

    var attr_air_list = document.querySelector('script[data-air-list]');
    var data_air_list = attr_air_list.getAttribute('data-air-list');

    const list_of_indoor_air = JSON.parse(data_air_list);

    var timestamps = []
    var indoor_co2 = []
    var indoor_tvoc = []

    var latest_iaq = list_of_indoor_air[0][2]

    list_of_indoor_air.forEach(element => {
        indoor_co2.push(element[0]);
        indoor_tvoc.push(element[1]);
        timestamps.push(element[2]);
    });

    $('#latest-quality-co2').html(indoor_co2.at(0) + ' ppm');
    $('#latest-quality-tvoc').html(indoor_tvoc.at(0)+ ' ppm');

    var graphTargetIndoorAirPollutants = $("#meteo-quality-air-pollutants");
    var graphTargetWellBeingLevel = $("#dashboard-well-being");

    var meteoQualityCo2Data = {
        labels: timestamps,
        datasets: [{
                label: "Indoor Air Co2 Level",
                type: "line",
                borderColor: "#ffba4d",
                backgroundColor: "#ffba4d",
                borderWidth: 2,
                data: indoor_co2.reverse(),
                fill: false
            },
            {
                label: "Indoor Air TVOCs Level",
                type: "line",
                borderColor: "#7fdd62",
                backgroundColor: "#7fdd62",
                borderWidth: 2,
                data: indoor_tvoc.reverse(),
                fill: false
            }
        ]
    };

    var meteoComfortLevelData = {
        labels: ["Well-Being Level", "Well-Being Level Supplument"],
        datasets: [{
            label: "Well-Being",
            data: [90, 10],
            backgroundColor: [
                "#7fdd62",
                "#EEEEEE",
            ]
        }]
    };

    var barGraph = new Chart(graphTargetIndoorAirPollutants, {
        type: 'line',
        data: meteoQualityCo2Data,
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
                            return value + " ";
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
                callbacks: {
                    label: function(tooltipItem, data) {
                        var legendLabel = data.datasets[tooltipItem.datasetIndex].label;
                        var dataLabel = data.labels[tooltipItem.index];
                        if (legendLabel == 'Indoor Air Co2 Level') {
                            var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' ppm';
                        } else {
                            var value = legendLabel + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() + ' ppm';
                        }
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
        }
    });

});