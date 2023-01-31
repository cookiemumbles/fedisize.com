import {data} from './data.js';
import { dataMastodon } from './data2.js';

function main() {


  console.log(dataMastodon);
  renderData(dataMastodon)
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
  var data = []
  for (const entry of rawData) {
    data.push({x:entry.date, y:entry.user_growth})
  }

  // console.log(JSON.stringify(data))

  const chartDiv = document.getElementById('myChart')

  var chart = new Chart(chartDiv, {
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
  chart.update();
}


document.addEventListener("DOMContentLoaded", function(){
  main();
});
