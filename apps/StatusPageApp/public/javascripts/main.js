var app = {

    jiveURL : opensocial.getEnvironment()['jiveUrl'],
    
	context : null,
	
    currentView : null,
    
	init : function() {
		//** LOAD CURRENT VIEW ***
		this.currentView = gadgets.views.getCurrentView().getName();
		/*** LOAD CONTEXT ***/
		osapi.jive.core.container.getLaunchContext(this.handleContext);
	}, // end init

	handleContext : function(ctx) {
		var appObj = this;
		app.context = ctx.jive.context;
		app.loadStatus();
		app.loadIncidents();
	},
	
	loadStatus : function() {
		var appObj = this;	
		osapi.jive.connects.get({
        alias : 'StatusPageIncidents',
        href : '/components.json'
    	}).execute(function(response) {
			if (response.error) {
				$('#component_status').html("Received the following error: " + JSON.stringify(response.error, null, '\t'));
				gadgets.window.adjustHeight();
			}
			else {
				response.content.map(function(obj){
					if (obj.id == app.context.body.component_update.component_id){
						app.renderStatus(obj.name, obj.status);
					}
				})
			}
		})
	},
	
	renderStatus : function(name, status) {
		var appObj = this;
		$('#component_status').addClass(status);
		$('#component_status').html(name+" current status is: "+status);
	},
		
	loadIncidents : function(){
		var appObj = this;	
		osapi.jive.connects.get({
        alias : 'StatusPageIncidents',
        href : '/incidents.json'
    	}).execute(function(response) {
			if (response.error) {
				$('#incidents').html("Received the following error: " + JSON.stringify(response.error, null, '\t'));
				gadgets.window.adjustHeight();
			}
			else {
				var reData = response.content.map(function(obj){
					var rObj = []; // New array to contain the incidents that belong to the component dated after this activity was generated
					var count = 0;
					obj.components.forEach(function(component){
						if (component.id == app.context.body.component_update.component_id){
							obj.incident_updates.forEach(function(incident){
								var componentUpdatedAt = new Date(app.context.body.component_update.created_at);
								var incidentCreatedAt = new Date(incident.created_at);
								if(incidentCreatedAt > componentUpdatedAt){
									rObj[count] = {
										'name' : obj.name,
										'status' : obj.status,
										'component_updated_at' : component.updated_at,
										'incident_updates' : incident,
										'incident_id' : obj.incident_updates[0].incident_id,
										'body' : obj.incident_updates[0].body,
										'timestamp' : incidentCreatedAt,
										'component_id' : component.id
									};
									count++;
								}
							})
						}
					})
					return rObj;
				})
				reData = reData.filter(function(element){return element.length > 0;})
				app.renderIncidents(reData);
			}
   		 })	
	},
	
	renderIncidents : function(data){
		var appObj = this;
		if (data.length == 0){
			$("#incidents").html("No incidents reported since this status was created.");
			gadgets.window.adjustHeight();
		}
		else {
			$("#incidents").empty();
			for (var i in data){
				var $titleDiv = "<div class='incident_title'>" + data[i][0].name + "<button onclick='app.deleteIncident(\""+data[i][0].incident_id+"\")'>Delete Incident</button></div>",
					$bodyDiv = "<div class='incident_body'><strong>"+data[i][0].status+"</strong> - "+data[i][0].body+"</div>",
					$updateTime = "<div class='incident_timestamp'>"+data[i][0].timestamp.toUTCString()+"</div>",
					$incidentContent = $titleDiv + $bodyDiv + $updateTime;
				$("<div />",{
					"class" : "incident", 
					id : data[i][0].incident_id,
					html : $incidentContent
				}).appendTo("#incidents");
			}
			gadgets.window.adjustHeight();
		}
	},
	
	addIncident : function(){
		var appObj = this;
		var field = $(":input").serializeArray();
		var message = "";
		field.forEach(function(obj){
			message += obj.name + "=" + obj.value + "&";
		})
		message += "incident[component_ids][]=" + app.context.body.component_update.component_id;
		osapi.jive.connects.post({
			alias : 'StatusPageIncidents',
			href : '/incidents.json',
			headers : {'Content-Type' : "application/x-www-form-urlencoded"},
			body : encodeURI(message)
    	}).execute(function(response) {
			if (response.error) {
				$('#incidents').html("Received the following error: " + JSON.stringify(response.error, null, '\t'));
				gadgets.window.adjustHeight();
			}
			else {
				app.loadIncidents();
				app.incidentForm();
			}
    	})
		event.preventDefault();
	},
	
	deleteIncident : function(incident_id){
		var appObj = this;
		osapi.jive.connects.delete({
			alias : 'StatusPageIncidents',
			href : '/incidents/'+incident_id+'.json'
		}).execute(function(response){
			if (response.error){
				$('#incidents').html("Received the following error: " + JSON.stringify(response.error, null, '\t'));
				gadgets.window.adjustHeight();
			}
			else {
				app.loadIncidents();
			}
		})
	},
	
	incidentForm : function() {
		$("#incident_form").slideToggle("slow", function(){
			if ($("#display_form_button").text() == "▼ Show Create Incident Form ▼"){
				$("#display_form_button").html("&#9650; Hide Create Incident Form &#9650;");
				gadgets.window.adjustHeight();
			}
			else {
				$("#display_form_button").html("&#9660; Show Create Incident Form &#9660;");
				gadgets.window.adjustHeight();
			}
		});
	}	
}

gadgets.util.registerOnLoadHandler(gadgets.util.makeClosure(app, app.init));