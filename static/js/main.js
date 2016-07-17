
$(document).on('ready', function(){

	$("#no-location-found").hide();	
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

    $("#search-field-box").click(function(event){
        $this = $(this);
        $this.val('');
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
    
    $("#no-location-found").hide();
              
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    map.setTilt(45);
        
    // Multiple Markers
    no_of_movies = Object.keys(response).length;
    var markers = [];
    var i = 0;

    for(i=0; i<no_of_movies; i++){

    	var movie_marker = []
    	var movie_title = response[i].title;
    	var no_of_locations = Object.keys(response[i].location).length;
    	var j = 0;
    	
    	for(j=0; j<no_of_locations; j++){
    	
    		var loc = response[i].location[j].location;
    		var funfacts = response[i].location[j].fun_facts;
    		var latitude = response[i].location[j].latlong.lat;
    		var longitude = response[i].location[j].latlong.lng;

    		movie_marker = [movie_title, loc, funfacts, latitude, longitude];
    		markers.push(movie_marker);
    	}
    	
    }

    // Info Window Content
    var total_markers = markers.length

    if (total_markers > 0){
	    var infoWindowContent = [];

		for(i=0; i< total_markers; i++){
			var location = markers[i][1];
			var funfacts = markers[i][2];

			var a = '<div class="info_content">';
			var b = "<h3>" + location + "</h3>";
			var c = "<p>" + funfacts + "</p>";
			var d = '</div>';
			if (funfacts != null){
				var e = a + b + c + d;
			}
			else{
				var e = a + b + d;	
			}

			var infoElement = [e];
			infoWindowContent.push(infoElement);
		}
	        
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
	                infoWindow.setContent(infoWindowContent[i][0]);
	                infoWindow.open(map, marker);
	            }
	        })(marker, i));

	        // Automatically center the map fitting all markers on the screen
	        map.fitBounds(bounds);
	    }

	    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
	    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
	        this.setZoom(11);
	        google.maps.event.removeListener(boundsListener);
	    });
	}
	else{
		$("#no-location-found").show();
		initialize();
	}
}


function populateSearchFieldList(id) {
	if (id == null){
		id = 'title';
	}
	var url = "/searchfieldlist/" + id;
    $.get(url, function(response) {
        var i = 0;
        // console.log(response);

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
            console.log("No location found");
        }
    });
}

function searchformsubmit() {
    // console.log("string info submit is working!") // sanity check

    $.ajax({
           type: "POST",
           url: "/searchformsubmit/",
           data: $("#search-form").serialize(), // serializes the form's elements.
           // dataType: 'json',

           success: function(data){
                // console.log("searched Succesfully");
                console.log(data);
                initialize2(data);

                $container = $('.results-content');

                no_of_movies = Object.keys(data).length;

                $container.html("");

	            $container.append($("<h5 id='result-count'>").text(no_of_movies));
	            if (no_of_movies == 1){
	            	$container.append("<h5>Movie Found</h5>");
	        	}
	        	else {
	        		$container.append("<h5>Movies Found</h5>");	
	        	}

	        	var f = document.createDocumentFragment();

    	        var d = document.createElement('ul');
    	        $(d).addClass('results');
    	        $(d).attr('id','results');

	            var i = 0;
	            for(i=0; i< no_of_movies; i++){

	            	var l = document.createElement('li');
	            	$(d1).addClass('result');
		            $(d1).attr('id','result');

		            var d1 = document.createElement('div');
		            $(d1).addClass('title');
		            $(d1).attr('id','title');
		            $(d1).append("<h3> Movie :</h3>");
		            $(d1).append($("<h3 id='actor1'>").text(data[i].title));
		            $(l).append($(d1));

		            if (data[i].release_year != null){
			            var d2 = document.createElement('div');
			            $(d2).addClass('release-year');
			            $(d2).attr('id','release-year');
			            $(d2).append("<h3> Release Year :</h3>");
			            $(d2).append($("<h3 id='year'>").text(data[i].release_year.year));
			            $(l).append($(d2));
		           }

		            if (data[i].production_company != null){
						var d3 = document.createElement('div');
			            $(d3).addClass('production_company');
			            $(d3).attr('id','production_company');
			            $(d3).append("<h3> Production Company :</h3>");
			            $(d3).append($("<h3 id='pc'>").text(data[i].production_company.production_company));
			            $(l).append($(d3));	            
	            	}

	            	if (data[i].distributor != null){
	            		no_of_distributors = Object.keys(data[i].distributor).length;
			            
			            var d4 = document.createElement('div');
			            
			            $(d4).addClass('distributor');
			            $(d4).attr('id','distributor');
			            $(d4).append("<h3> Distributor :</h3>");
			            $(d4).append($("<h3 id='distri'>").text(data[i].distributor.distributor));
			            $(l).append($(d4));
		        	}
		        	if (data[i].director != null){
			            var d5 = document.createElement('div');
			            $(d5).addClass('director');
			            $(d5).attr('id','director');

			           	no_of_directors = Object.keys(data[i].director).length;

			           	if(no_of_directors > 0){
				           	if(no_of_directors == 1){
				           		$(d5).append("<h3> Director :</h3>");	
				           	}
			           		else{
			           			$(d5).append("<h3> Directors :</h3>");
			           		}
			            	var j = 0;
			            	for(j=0; j<no_of_directors; j++){
				            	$(d5).append($("<h3 id='direc'>").text(data[i].director[j].director));
				        	}
				        	$(l).append($(d5));
						}
					}

					$(d).append($(l));
		        }

	            f.appendChild(d);
	            $container.append(f);
            }
    });
}
