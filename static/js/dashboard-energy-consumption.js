$(document).ready(function() {

    var monthlyEnergyDemandData = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        datasets: [{
            label: "Energy Demand",
            type: "bar",
            borderColor: "#ffba4d",
            backgroundColor: "#ffba4d",
            data: [10, 10, 20, 30, 50, 30, 10, 40, 30, 20, 10, 40]
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
                        return tooltipItems.yLabel + ' kWh';
                    },
                }
            },
        }
    });

});