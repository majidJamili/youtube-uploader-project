//Initilizing Autocomplete feature by loading the page: 


window.addEventListener('load', (e) => {
  initialize()
});


var siteResponses = []; 

// initilization function
function initialize() {

  var input = document.getElementById('autocomplete_search');

  var autocomplete = new google.maps.places.Autocomplete(input);
  const map = document.getElementById('map'); 


  autocomplete.addListener('place_changed', function () {
  map.innerHTML = ''; 


  var place = autocomplete.getPlace();
  var place_id = place.reference; 
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();
  var coordinate = [longitude, latitude]

  console.log(place_id)
      if(place_id){
           const iframe = document.createElement('iframe');
            iframe.width = '550' ;
            iframe.loading = 'eager'; 
            iframe.height = '350'; 
            iframe.allowFullscreen = true; 
            iframe.src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAP_KEY}&q=place_id:${place_id}` 
            map.appendChild(iframe); 
      }

      window.siteResponses = {
      title: document.getElementById('title').value, 
      coordinate: [longitude, latitude], 
      google_place_id: place.reference,
      address: place.formatted_address, 
      contact: document.getElementById('contact').value
    }
});}



//sent data to server and DB
async function submitResponse() {
  initialize()
  console.log('data received is: ', siteResponses)
  const rawResponse = await fetch('/sites/add' ,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({data:siteResponses})

    });
    const content = await rawResponse.json();
    return content; 
}


function cleanSiteForm(){
  document.getElementById('site-form').reset(); 
}

function submitSite(){
  submitResponse()
  cleanSiteForm()
}


