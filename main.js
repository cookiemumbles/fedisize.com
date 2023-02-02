/*

getting stats:
- https://api.joinmastodon.org/statistics
    - server_count, user_count, active_user_count
    - updated once a day
- https://instances.social (through auth api)
  - probably results like: https://instances.social/list/old
  - no history, only current
- https://techhub.social/@mastodonusercount@bitcoinhackers.org
    - https://github.com/gallizoltan/usercount
    - reads https://instances.social
    - history through crawling toots
    - only user count
- https://simonwillison.net/2022/Nov/20/tracking-mastodon/
    - uses https://instances.social/instances.json
    - checks in git history: https://github.com/simonw/scrape-instances-social
    - openRegistrations, users, statuses, connections
- https://fediverse.observer/stats (https://gitlab.com/diasporg/poduptime/)
  - has big history, but does not appear to be callable through api
  - could get data through website (hardcoded; probably page generated)
      -> see data2.js

Blocked servers:
- https://joinfediverse.wiki/FediBlock
- https://writer.oliphant.social/oliphant/blocklists
  - https://codeberg.org/oliphant/blocklists/src/branch/main/blocklists/

*/

const colors = {
  "mastodon": "rgb(99, 100, 255)",
  "diaspora": "rgb(34, 34, 34)"
}

let _currentData = []
let _chart = null

function main() {

  //usage:
  readTextFile("combined.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
    renderData(preproccessData(data))
  });

  // console.log(dataMastodon);
  // renderData(dataMastodon)
}

function preproccessData(rawData) {
  return rawData
    .filter((entryObj) => {
      // return entryObj.name == "diaspora"
      return entryObj.name != "all"
    })
    .sort(function(a, b){
      let lastGrowthA = a.values[a.values.length -1].user_growth
      let lastGrowthB = b.values[b.values.length -1].user_growth
      var result = lastGrowthA - lastGrowthB 
      if (result) {
        return result
      } else {
        return -1
      }
    })
}

function getColor(name) {
  if (name in colors) {
    return colors[name]
  } else {
    return '#' + Math.floor(Math.random()*16777215).toString(16)
  }
}

function renderData(graphData) {
  _currentData = graphData
  
  const chartDiv = document.getElementById('myChart')

  if (!_chart) {
  _chart = new Chart(chartDiv, {
    type: 'line',
    data: {
      datasets: graphData
      .map((entryObj, i) => {
        const color = getColor(entryObj.name)
        return {
          label: entryObj.name,
          backgroundColor: color,
          borderColor: color,
          fill: true,
          data: entryObj.values.map((entry) => {
            return {x:entry.date, y:entry.user_growth}
          })
        }
  })
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
  } else {
    _chart.data.datasets = graphData
      .map((entryObj, i) => {
        const color = '#' + Math.floor(Math.random()*16777215).toString(16)
        return {
          label: entryObj.name,
          // backgroundColor: 'rgb(255, 99, 132)',
          backgroundColor: color,
          borderColor: color,
          fill: true,
          data: entryObj.values.map((entry) => {
            return {x:entry.date, y:entry.user_growth}
          })
        }

      })
  }
  _chart.update();
}


function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

document.addEventListener("DOMContentLoaded", function(){
  main();
});
