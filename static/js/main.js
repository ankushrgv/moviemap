
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
                console.log(data);
           }
    });
}
