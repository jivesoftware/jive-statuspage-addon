function transform(body, headers, options, callback)   {

/*
 * TO DO: Parse 'body' arg based on incoming event from 3rd party system.
 * TO DO: Replace the sample code below with your own transformation code.
 */

var component = {
	'xyk3yzfdk9kl': {
		'name': "Marketing Services",
		'img': "https://raw.githubusercontent.com/jivesoftware/jive-statuspage-addon/master/resources/images/marketing_services.png"
	},
	'f0smn2s09lv4': {
		'name': "Cloud Data Server",
		'img': "https://raw.githubusercontent.com/jivesoftware/jive-statuspage-addon/master/resources/images/cloud_data_server.png"
	}
}

var desc = {
	'operational':  "Operational",
	'degraded_performance': "Degraded Performance",
	'partial_outage': "Partial Outage",
	'major_outage': "Major Outage!"
}

// Build activity object.
var activityInfo = { actor: {}, object:{} };

// Optional name of actor for this activity. Remove if n/a.
// activityInfo.actor.name = "Jane Doe";

// Optional email of actor for activity. Remove if n/a.
// activityInfo.actor.email = "janedoe@example.com";

// Optional URL for this activity. Remove if n/a.
activityInfo.object.url = "https://jivesoftware3.statuspage.io/";

// Required URL to the image for this activity.
activityInfo.object.image = component[body.component_update.component_id].img;

// Required title of the activity.
activityInfo.object.title = component[body.component_update.component_id].name;

// Optional HTML description of activity. Remove if n/a.
activityInfo.object.description = "New Status: " + desc[body.component_update.new_status];

/*
 * Call the callback function with our transformed activity information
 */

callback({ "activity" : activityInfo });
}