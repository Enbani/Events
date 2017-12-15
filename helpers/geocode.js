const axios = require('axios');

var geocodeAddress = (address) => {
	var encodeAddress = encodeURIComponent(address);
	var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;

	axios.get(geocodeUrl).then((response) => {
		if (response.data.status === "ZERO_RESULTS") {
			throw new Error('unable to find that address');
		}

		var lat = response.data.results[0].geometry.location.lat;
		var lng = response.data.results[0].geometry.location.lng;

		console.log(response.data.results[0].formatted_address);

		return lat, lng; 
	}).catch((err) => {
		// return and clean up error handling at some point
		console.log('The site could not be reached', err);
	})

}
