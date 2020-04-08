function initMap() {

  var name = document.getElementById("name").value;
  var number = document.getElementById("contact").value;
  var location = [-0.123559,50.832679];
  var status = 0;
  var traffic = 0;
  var type = document.getElementById("btype").value;

  console.log("initMap name" + name);

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
  firebase.firestore().collection('users').add(user_data)
  .then(ref => {
  console.log('Added document with ID: ', ref.id);
  localStorage.setItem('name',ref.id);
  console.log("saveToFirestore mission accomplished");
});
}