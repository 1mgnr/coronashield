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
var data = 
    [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [-0.123559,
                    50.832679
                ]
            },
            "type": "Feature",
            "properties": {
                "category": "cafe",
                "hours": "8am - 9:30pm",
                "description": "Grab a freshly brewed coffee, a decadent cake and relax in our idyllic cafe. We're part of a larger chain of patisseries and cafes.",
                "name": "Josie's Cafe Brighton",
                "phone": "+44 1313 131313",
                "storeid": "11"
            }
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [-3.319575,
                    52.517827
                ]
            },
            "type": "Feature",
            "properties": {
                "category": "cafe",
                "hours": "8am - 9:30pm",
                "description": "Come in and unwind at this idyllic cafe with fresh coffee and home made cakes. We're part of a larger chain of patisseries and cafes.",
                "name": "Josie's Cafe Newtown",
                "phone": "+44 1414 141414",
                "storeid": "12"
            }
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    1.158167,
                    52.071634
                ]
            },
            "type": "Feature",
            "properties": {
                "category": "cafe",
                "hours": "8am - 9:30pm",
                "description": "Fresh coffee and delicious cakes in an snug cafe. We're part of a larger chain of patisseries and cafes.",
                "name": "Josie's Cafe Ipswich",
                "phone": "+44 1717 17171",
                "storeid": "13"
            }
        }
    ]




// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'};
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
      return entities[char];
    });
    result += strings[i];
  }
  return result;
}

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

    console.log(latitude);
    console.log(longitude);
  });

  const apiKey = 'AIzaSyDVePLEyIG6-3OBo-Zo9CCVCDQtzssSl6w';

  const rankedStores = calculateDistances(latitude, longitude);
  console.log(rankedStores);
  showStoresList(rankedStores);
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
  const stores = [];

  // Build parallel arrays for the store IDs and destinations
  data.forEach((store) => {
    const storeLat = store.geometry.coordinates[0];
    const storeLng = store.geometry.coordinates[1];

    var dist = distance(latitude, longitude, storeLat, storeLng, "K");

    if(dist<8000)
    {
      const distanceObject = {
                storeid: store.properties.storeid,
                distanceVal: dist,
              };
      stores.push(distanceObject);
    }
  });

  stores.sort((first, second) => {
    return first.distanceVal - second.distanceVal;
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

    const name = document.createElement('p');
    name.classList.add('place');

    // const currentStore = data.getFeatureById(store.storeid);
    // name.textContent = currentStore.getProperty('name');

    name.textContent = store.storeid;
    panel.appendChild(name);
    const distanceText = document.createElement('p');
    distanceText.classList.add('distanceText');
    distanceText.textContent = store.distanceVal;
    panel.appendChild(distanceText);
  });

  // Open the panel
  panel.classList.add('open');

  return;
}
