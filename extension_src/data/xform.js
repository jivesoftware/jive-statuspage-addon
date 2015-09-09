function transform(body, headers, options, callback)   {

// Since StatusPage only gives component ID's in the payload,
// and we know what those ID's will be, we give it UI friendly names
// In addition to that, we are giving the corresponding image we are associating with the component
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

// We are making the output of the status look nicer and avoiding loops that might exceed the 250ms
// time limit that the transform function has to complete
var desc = {
	'operational':  "Operational",
	'degraded_performance': "Degraded Performance",
	'partial_outage': "Partial Outage",
	'major_outage': "Major Outage!"
}

// Build activity object.
var activityInfo = { actor: {}, object:{}, jive:{} };

// Optional URL for this activity. Remove if n/a.
activityInfo.object.url = "https://jivesoftware3.statuspage.io/";

// Required URL to the image for this activity.
activityInfo.object.image = component[body.component_update.component_id].img;

// Required title of the activity.
activityInfo.object.title = component[body.component_update.component_id].name;

// Optional HTML description of activity. 
activityInfo.object.description = "New Status: " + desc[body.component_update.new_status];

function clone(obj) {  
  if (null == obj || "object" != typeof obj) return obj;  
  var copy = {};  
  for (var attr in obj) {  
      copy[attr] = clone(obj[attr]);  
  }  
return copy;  
}  
body = clone(body);  
headers = clone(headers);  
options = clone(options);  
  
activityInfo.jive.app = {  
  'appUUID': "9b7c6342-542f-42bb-aa18-03c06652cc8e",  
  'view': "ext-object",  
  'context': {  
    'timestamp': new Date().getTime(),  
    'body': body,  
    'headers': headers,  
    'options': options,  
    'resources': {  
        'components': component,  
        'descriptions': desc  
    }  
  }  
}

/*
 * Call the callback function with our transformed activity information
 */

callback({ "activity" : activityInfo });
}