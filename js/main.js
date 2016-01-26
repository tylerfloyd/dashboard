$(init);

function init(){
	$.getJSON( 'props.json', function(data){
	  	CLIENT_ID = data.CAL_CLIENT_ID;
		startNest(data.NEST_ACCESS_TOKEN);
		NEST_CAM_URL = data.NEST_CAM_URL;
	});

	shortcut.add('F1',function() {
		$('#increase').click();
	});

	shortcut.add('F2',function() {
		$('#decrease').click();
	});

	setTimeout(function(){
		$('.dropCam').html('<iframe type="text/html" frameborder="0" width="585" height="425" src="//video.nest.com/embedded/live/'+NEST_CAM_URL+'?autoplay=1"></iframe>');
	},2000);
}