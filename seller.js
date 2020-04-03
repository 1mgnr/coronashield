function initMap() {
  var name = "Chai wala";
  var number = "+911234567890";
  var location = [-0.123559,50.832679];
  var status = 0;
  var traffic = 0;
  var type = "Drinks";

  var user_data = {
    name : name,
    number : number,
    location : location,
    status : status,
    traffic : traffic,
    type : type
  }

  saveToFirestore(user_data);
}

function saveToFirestore(user_data) {
  firebase.firestore().collection('users').add(user_data);
}