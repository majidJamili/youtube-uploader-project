

window.addEventListener('load', (e) => {
  initialize()
});


function initialize() {

  var input = document.getElementById('autocomplete_search');

  var autocomplete = new google.maps.places.Autocomplete(input);
  const map = document.getElementById('map'); 


  autocomplete.addListener('place_changed', function () {
    map.innerHTML = ''; 


  var place = autocomplete.getPlace();

  const place_id = place.reference; 
      if(place_id){
           const iframe = document.createElement('iframe');
            iframe.width = '550' ;
            iframe.loading = 'eager'; 
            iframe.height = '350'; 
            iframe.allowFullscreen = true; 
        iframe.src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAP_KEY}&q=place_id:${place_id}` 
            map.appendChild(iframe); 
      }
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    document.getElementById('lat').value = latitude;
    document.getElementById('lng').value = longitude;
  document.getElementById('google_id').value = place_id;
});}



