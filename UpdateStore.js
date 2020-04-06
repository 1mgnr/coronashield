
function updateStatus(id, status) {
  firebase.firestore().collection('users').doc(id).update({
  status: status
});
  console.log("status updated");
}

function updateTraffic(id, traffic) {
  firebase.firestore().collection('users').doc(id).update({
  traffic: traffic
});
  console.log("traffic updated");
}