/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
var data = {};

/**
 * Initialize the Google Map.
 */
function initMap() {
  // Create the map.
  var latitude = 52.632469;
  var longitude = -1.689423;
  navigator.geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log("mylat " + latitude);
    console.log("mylng " + longitude);

     firebase.firestore().collection("users")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                //console.log("New city: ", change.doc.id);
                data[change.doc.id] = change.doc.data();
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
                data[change.doc.id] = change.doc.data();
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
                delete data[change.doc.id];
            }
        });
        const rankedStores = calculateDistances(latitude, longitude);
        console.log(rankedStores);
        showStoresList(rankedStores);
    });
  });

  const apiKey = 'AIzaSyDVePLEyIG6-3OBo-Zo9CCVCDQtzssSl6w';
}

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }
}

function calculateDistances(latitude, longitude) {
  var stores = [];

  for (var i in data){
    const storeLat = data[i].location[0];
    const storeLng = data[i].location[1];

    // console.log("latitude " + latitude);
    // console.log("longitude " + longitude);
    // console.log("storeLat " + storeLat);
    // console.log("storeLng " + storeLng);

    var dist = distance(latitude, longitude, storeLat, storeLng, "K");

    if(dist<2000)
    {
      data[i].dist = dist;
      stores.push(i);
    }
  }

  stores.sort((first, second) => {
    return data[first].dist - data[second].dist;
  });

  return stores;
}

function showStoresList(stores) {
  if (stores.length == 0) {
    console.log('empty stores');
    return;
  }

  let panel = document.createElement('div');
  // If the panel already exists, use it. Else, create it and add to the page.
  if (document.getElementById('panel')) {
    panel = document.getElementById('panel');
    // If panel is already open, close it
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
    }
  } else {
    panel.setAttribute('id', 'panel');
    const body = document.body;
    body.insertBefore(panel, body.childNodes[0]);
  }


  // Clear the previous details
  while (panel.lastChild) {
    panel.removeChild(panel.lastChild);
  }

  stores.forEach((store) => {
    // Add store details with text formatting
    console.log(store);

    //name
    const name = document.createElement('p');
    name.classList.add('place');
    name.textContent = data[store].name;
    panel.appendChild(name);

    const distanceText = document.createElement('p');
    distanceText.classList.add('distanceText');
    distanceText.textContent = "number : " + data[store].number + " type : " + data[store].type + " status : " + data[store].status + " traffic : " + data[store].traffic + " distance : " + data[store].dist;
    panel.appendChild(distanceText);
  });

  // Open the panel
  panel.classList.add('open');

  return;
}
