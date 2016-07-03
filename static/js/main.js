
$(document).on('ready', function(){

	initialize();
	google.maps.event.addDomListener(window, 'load', initialize);

	var search_type = null;
	populateSearchFieldList(search_type);

	$("#search-type-select").change(function () {
        var selectedType = $('#search-type-select').val();
        populateSearchFieldList(selectedType);
    });

	$("#search-form-submit").click(function (event) {
		// alert("form submit clicked!!");
		event.preventDefault();
		searchformsubmit();
    });	

});


function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(37.773972,-122.431297),
    zoom:12,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}


function initialize2(response) {
	var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
    
    console.log(response);                
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    map.setTilt(45);
        
    // Multiple Markers
    no_of_movies = Object.keys(response).length;
    console.log(no_of_movies);

    var markers = [];

    var i = 0;

    for(i=0; i<no_of_movies; i++){

    	console.log('entered');

    	var movie_marker = []
    	var movie_title = response[i].title;
    	var no_of_locations = Object.keys(response[i].location).length;
    	console.log(no_of_locations);
    	var j = 0;
    	
    	for(j=0; j<no_of_locations; j++){
    	
    		var loc = response[i].location[j].location;
    		var funfacts = response[i].location[j].fun_facts;
    		var latitude = response[i].location[j].latlong.lat;
    		var longitude = response[i].location[j].latlong.lng;

    		// console.log('loc = ', loc);
    		// console.log('funfacts = ', funfacts);
    		// console.log('lati = ', latitude);
    		// console.log('longi = ', longitude);


    		movie_marker = [movie_title, loc, funfacts, latitude, longitude];
    		// console.log(movie_marker);
    		markers.push(movie_marker);
    	}
    	
    }

    console.log(markers);
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][3], markers[i][4]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][1]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(12);
        google.maps.event.removeListener(boundsListener);
    });
}


function populateSearchFieldList(id) {
	if (id == null){
		id = 'title';
	}
	var url = "/searchfieldlist/" + id;
    $.get(url, function(response) {
        var i = 0;
        console.log(response);

        if (response.length > 0) {             
        	var searchFieldOptions = [];

            $.each(response,function(){
            	if (id == 'title')
            		searchFieldOptions.push(response[i].title);
            	else if(id == 'production_company')
            		searchFieldOptions.push(response[i].production_company);
				else if(id == 'distributor')
            		searchFieldOptions.push(response[i].distributor);
				else if(id == 'director')
            		searchFieldOptions.push(response[i].director);
				else if(id == 'writer')
            		searchFieldOptions.push(response[i].writer);
				else if(id == 'actor')
            		searchFieldOptions.push(response[i].actor);

            	i++;
            });

            $(function() {
				$("#search-field-box" ).autocomplete({
				  source: searchFieldOptions
				});
			});
            
        } else {
            console.log("No match found");
        }
    });
}

function searchformsubmit() {
    console.log("string info submit is working!") // sanity check

    $.ajax({
           type: "POST",
           url: "/searchformsubmit/",
           data: $("#search-form").serialize(), // serializes the form's elements.
           // dataType: 'json',

           success: function(data){
                // if(alert("New Institute Added Succesfully!!")){}
                // else
                //     window.location.reload(); 
                console.log("searched Succesfully");
                // console.log(data);
                initialize2(data);
           }
    });
}
