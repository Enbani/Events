const axios = require('axios');
const yargs = require('yargs');
const keys = require('./keys/keys.js');

// provide options for command-line arguments
const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: "Address to fetch weather information.",
			string: true
		}

})
	.help()
	.alias('help', 'h')
	.argv;


var encodeAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;

// or whatever your key is for ebrite
var eKey = keys.appKeys.ebrite.oAuthToken;



axios.get(geocodeUrl).then((response) => {
	if (response.data.status === "ZERO_RESULTS") {
		throw new Error('unable to find that address');
	}

	var lat = response.data.results[0].geometry.location.lat;
	var lng = response.data.results[0].geometry.location.lng;

	console.log(response.data.results[0].formatted_address);

	var eventUrl = `https://www.eventbriteapi.com/v3/events/search/?token=${eKey}&location.latitude=${lat}&location.longitude=${lng}&location.within=5mi`;

	return axios.get(eventUrl);

}).then((response) => {
	var events = response.data.events;

	for (i in events) {
		var eventData = {
			title: events[i].name.text,
			description: events[i].description.text,
			event_start_time: events[i].start.local,
			event_end_time: events[i].end.local,
			is_free: events[i].is_free,
			ebrite_id: events[i].id,
			url: events[i].url,
			venue_id: events[i].venue_id,
			created: events[i].created,
			changed: events[i].changed,
			category_id: events[i].category_id,
			subcategory_id: events[i].category_id,
			is_gathr: false,
			user_ids: [],
			logo: events[i].logo.original.url
		};

		var eventString = JSON.stringify(eventData, undefined, 4);

		console.log(eventString);
	};
},() => {
	console.log('Error');
})