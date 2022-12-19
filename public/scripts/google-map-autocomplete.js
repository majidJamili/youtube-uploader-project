



google.maps.event.addDomListener(window, 'load', initialize);
var latitude = ''; 
var longitude =''; 
var latlng = {}; 


function initialize() {

  var input = document.getElementById('autocomplete_search');

  var autocomplete = new google.maps.places.Autocomplete(input);
  const map = document.getElementById('map'); 


  autocomplete.addListener('place_changed', function () {
    map.innerHTML = ''; 


  var place = autocomplete.getPlace();
  console.log(place.formatted_address)
  console.log(place.reference)
  const place_id = place.reference; 
      if(place_id){
           const iframe = document.createElement('iframe');
            iframe.width = '550' ;
            iframe.loading = 'eager'; 
            iframe.height = '350'; 
            iframe.allowFullscreen = true; 
            iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAqEC6E_t0LzLmtnminHw3Y99kHjmOZRl4&q=place_id:${place_id}` 
            map.appendChild(iframe); 
      }
  document.getElementById('google_id').value = place_id;
});}



