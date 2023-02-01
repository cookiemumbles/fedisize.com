import {data} from './data.js';
import { dataMastodon } from './data2.js';

function main() {

  //usage:
  readTextFile("combined.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
    renderData(data)
  });

  // console.log(dataMastodon);
  // renderData(dataMastodon)
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

function renderData(rawData) {
  var dataSets = []
  rawData
  .filter((entryObj) => {
    return entryObj.name != "all"
  })
    .sort(function(a, b){
      var result = a.values[a.values.length -1].user_growth - b.values[b.values.length -1].user_growth
      console.log(`${a.name} > ${b.name}: ${a.values[a.values.length -1]} - ${b.values[b.values.length -1]}`, b.values[b.values.length - 1])
      if (result) {
        console.log("result:", result)
        return result
      } else {
        return 0
      }
    })
    .forEach((entryObj) => {
      dataSets.push({
        label: entryObj.name,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: entryObj.values.map((entry) => {
          return {x:entry.date, y:entry.user_growth}
        })
      })
  })

  const chartDiv = document.getElementById('myChart')

  var chart = new Chart(chartDiv, {
    type: 'line',
    data: {
      datasets: dataSets
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month'
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
  chart.update();
}


document.addEventListener("DOMContentLoaded", function(){
  main();
});
