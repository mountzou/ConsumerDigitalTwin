$(document).ready(function() {

    var monthlyMonthlyEnergyProductionData = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        datasets: [{
            label: "Energy Production",
            type: "bar",
            borderColor: "#7fdd62",
            backgroundColor: "#7fdd62",
            data: [1, 1, 1, 1, 1, 1, 3, 5, 5, 6, 12, 20, 25, 30, 30, 20, 18, 10, 5, 1, 1, 1, 1, 1]
        }]
    };

    var monthlyDailyEnergyProductionData = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        datasets: [{
            label: "Energy Production",
            type: "bar",
            borderColor: "#7fdd62",
            backgroundColor: "#7fdd62",
            data: [10, 10, 20, 30, 50, 30, 10, 40, 30, 20, 10, 40, 55, 42, 44, 10, 10, 4, 5, 6]
        }]
    };

    var graphTargetMonthlyEnergyProduction = $("#dashboard-monthly-energy-production");
    var graphTargetDailyEnergyProduction = $("#dashboard-daily-energy-production");

    var barGraph = new Chart(graphTargetMonthlyEnergyProduction, {
        type: 'bar',
        data: monthlyMonthlyEnergyProductionData,
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

    var barGraph = new Chart(graphTargetDailyEnergyProduction, {
        type: 'bar',
        data: monthlyDailyEnergyProductionData,
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