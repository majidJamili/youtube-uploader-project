



google.maps.event.addDomListener(window, 'load', initialize);
var latitude = ''; 
var longitude =''; 
var latlng = {}; 


function initialize() {

  var input = document.getElementById('autocomplete_search');

  var autocomplete = new google.maps.places.Autocomplete(input);


  autocomplete.addListener('place_changed', function () {

  var place = autocomplete.getPlace();
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();

  var suburb =  place.address_components[2].long_name;
  var state =  place.address_components[4].long_name;
  var country =  place.address_components[5].long_name;
  var zipcode =  place.address_components[6].long_name;

  document.getElementById('lat').value = latitude;
  document.getElementById('lng').value = longitude;
  document.getElementById('suburb').value = suburb; 
  document.getElementById('state').value = state; 
  document.getElementById('country').value = country; 
  document.getElementById('zipcode').value = zipcode; 
   window.latlng = {lat: latitude, lng: longitude}; 
   initMap()



});}



function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: latlng,
      zoom: 10,
      disableDefaultUI: false,

    });
    console.log('map', map)

    var marker = new google.maps.Marker({
        position: latlng, 
        map:map
    })
    }

    // window.initMap = initMap;