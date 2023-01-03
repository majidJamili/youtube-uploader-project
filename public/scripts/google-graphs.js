google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['VALUE-ADDING',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    // title: 'My Daily Activities'
    legend:'none',

    plugins:{
        legend:'none'
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('graph-container'));

  chart.draw(data, options);
}