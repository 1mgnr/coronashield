function initMap() {

  var name = document.getElementById("business_name").value;
  var number = document.getElementById("business_contact").value;
  var location = [-0.123559,50.832679];
  var status = 0;
  var traffic = 0;
  var type = document.getElementById("btype").value;

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
  //alert("Form Validated and saveToFirestore .....");
  firebase.firestore().collection('users').add(user_data);
  console.log("mission accomplished");
}