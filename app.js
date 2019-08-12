let assetsJson = require('./assets.json');

let fs = require('fs');

let movieJson;
let movieJsonSorted = {};

let groupBy = function (arr, key) {
  return arr.reduce(function (acc, x) {
    let obj = { id: x.id, year: x.production_year, title: x.title };
    if (!acc[x[key]]) {
      acc[x[key]] = [];
      acc['count'][x[key]] = 1;
    }
    else {
      acc['count'][x[key]]++;
    }
    acc[x[key]].push(obj);
    return acc;
  }, { count: {} });
};

movieJson = assetsJson.filter((obj) => {
  return obj.object_class === 'Movie';
});


movieJson.forEach(obj => {
  let fsk = obj.fsk_level_list_facet;

  if (fsk.length > 1) {
    let fskObj = JSON.parse(JSON.stringify(obj));
    let i = fsk.length;

    while (i > 1) {
      fskObj.fsk_level_list_facet = [fsk[i - 1]];
      movieJson.push(fskObj);
      fsk.pop();
      i--;
    };
  }
});

movieJson = groupBy(movieJson, 'fsk_level_list_facet');

const sortFsk = (a, b) => a.localeCompare(b, 'en', { numeric: true });

let movieJsonTemp= Object.keys(movieJson).sort(sortFsk);

movieJsonTemp.forEach(function(key){
  movieJsonSorted[key]= movieJson[key];
});

fs.writeFile("movieAssets.json", JSON.stringify(movieJsonSorted, null, 4), writeComplete);

function writeComplete() {
  console.log('Operation Complete!');
}