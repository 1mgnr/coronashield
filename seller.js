function initMap(latitude, longitude) {

  var name = document.getElementById("name").value;
  var number = document.getElementById("contact").value;
  var location = [latitude, longitude];
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
  var id = localStorage.getItem("storeId");
  console.log("id= " + id);
  if(id != null)
  {
    firebase.firestore().collection('users').doc(id).update(user_data)
    .then(ref => {
      console.log("saveToFirestore mission accomplished");
      window.location = "shopkeeper.html";
    });
  }
  else{
    firebase.firestore().collection('users').add(user_data)
    .then(ref => {
      console.log('Added document with ID: ', ref.id);
      localStorage.setItem('storeId',ref.id);
      console.log("saveToFirestore mission accomplished");
      window.location = "shopkeeper.html";
    });
  }
}