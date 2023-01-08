$(document).ready(function() {

    var monthlyEnergyDemandData = {
        labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        datasets: [{
            label: "Energy Demand",
            type: "bar",
            borderColor: "#ffba4d",
            backgroundColor: "#ffba4d",
            data: [4, 4, 2, 2, 2, 2, 2, 5, 5, 10, 3, 3, 6, 6, 6, 10, 15, 15, 20, 12, 12, 11, 10, 6]
        }]
    };

    var graphTargetMonthlyEnergyDemand = $("#dashboard-monthly-energy-demand");

    var barGraph = new Chart(graphTargetMonthlyEnergyDemand, {
        type: 'bar',
        data: monthlyEnergyDemandData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 12,
                        fontFamily: "Josefin Sans",
                        beginAtZero: true,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        callback: function(value, index, values) {
                            return value + " kWh";
                        },
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawOnChartArea: true
                    },
                    ticks: {
                        display: true,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        maxRotation: 0,
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
                        return tooltipItems.yLabel + ' kWh';
                    },
                }
            },
        }
    });

});