import {data} from './data.js';

function main() {

  console.log(data);
  renderData(data)
}

function renderData(rawData) {
  var data = []
  // for (const entry of rawData) {
  //   data.push({x:entry.date, y:entry.follower_count})
  // }

  // console.log(JSON.stringify(data))


  if (!chart) {
    chart = new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        datasets: [{
          label: 'Followers',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: data
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer: function (tooltipItems) {
                var tooltipItem = tooltipItems[0]
                var currentY = tooltipItem.parsed.y

                var previousY = (tooltipItem.dataIndex >= 1)
                  ? tooltipItem.dataset.data[tooltipItem.dataIndex - 1].y
                  : 0;
                var diff = currentY - previousY
                if (diff >= 0) {
                  var diffStr = "+ " + diff
                } else {
                  var diffStr = " " + diff
                }
                return "diff: " + diffStr
              },
            }
          }
        }
      }
    });
  } else {
    chart.data.datasets = [{
          label: 'Followers',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: data
        }]
  }
  chart.update();
}


document.addEventListener("DOMContentLoaded", function(){
  main();
});
