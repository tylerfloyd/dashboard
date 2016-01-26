function startNest(token){
	var access_token = Cookies.get('nestAccessToken');

	if(typeof access_token === 'undefined'){
		Cookies.set('nestAccessToken', token);
		access_token = Cookies.get('nestAccessToken');
	}

	REF = new Firebase('wss://developer-api.nest.com');
    REF.auth(access_token);
    REF.on('value', function (snapshot) {
        var data = snapshot.val();
        var devices = getFirstChild(data);
        var structures = getFirstChild(data.structures);
        var state = structures.away;
        
        $('.state').text('('+state.toUpperCase()+')');

        if(devices.hasOwnProperty('cameras')){

        }

        if(devices.hasOwnProperty('thermostats')){
        	setThermostatView(devices.thermostats);
        }
    });	

    $('.change_temp').on('click','button',function(e){
    	var newTemp = this.id === 'increase' ? THERMOSTAT.target_temperature_f+1 : THERMOSTAT.target_temperature_f-1;
    	adjustTemperature(newTemp);
    });
}

function getCameras(o){
	// do this later
}

function setThermostatView(o){
	var data = getFirstChild(o),
		ambient_temp = data.ambient_temperature_f,
		humidity = data.humidity,
	 	mode = data.hvac_mode + ' set to',
		target_temp = data.target_temperature_f;

	mode = mode.toUpperCase();
	THERMOSTAT = data;
	
	if(data.hvac_state !== 'off'){
		mode = data.hvac_state + ' to';
	}
	
	$('.thermostat').removeClass('off').removeClass('cooling').removeClass('heating').addClass(data.hvac_state.toLowerCase());

	$('#havc_mode').text(mode.toUpperCase());
	$('#target_temp').text(target_temp);

	if($('#inside_temp').children().length > 1)	$('#inside_temp span:last-child').remove();
	if($('#inside_humidity').children().length > 1) $('#inside_humidity span:last-child').remove();

	$('#inside_temp').append('<span>'+ambient_temp+'</span>');
	$('#inside_humidity').append('<span>'+humidity+'%</span>');
}

function adjustTemperature(newTemp){
	var path = 'devices/thermostats/' + THERMOSTAT.device_id + '/target_temperature_f';
	REF.child(path).set(newTemp);
}

// Helper functions
function getFirstChild(object) {
  for(var key in object) {
    return object[key];
  }
}