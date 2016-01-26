CLIENT_ID = '';
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        },
        handleAuthResult);
    return false;
}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
    // pull new calendar data every 15 minutes
    setInterval ( function(){pollNewData();}, 900000 );
}

function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        // 'maxResults': 15,
        'orderBy': 'startTime'
    });

    request.execute(function(resp) {
    	// console.log(resp);
        var eventObj = [],
            tempSt = {},
            events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < 50; i++) {
                tempSt = {};
                tempSt.title = events[i].summary;
                tempSt.allDay = false;

                if(events[i].start.dateTime){
                    tempSt.start = events[i].start.dateTime;
                }else{
                    tempSt.allDay = true;
                    tempSt.start = events[i].start.date;
                }
                 if(events[i].end.dateTime){
                    tempSt.end = events[i].end.dateTime;
                }else{
                    tempSt.end = events[i].end.date;
                }

                eventObj.push(tempSt);
            }

            buildCalendar(eventObj);
        } else {
            console.log('no events found?');
        }

    });
}

function buildCalendar(events) {
    $('#calendar').fullCalendar({
        header:false,
        aspectRatio: 2,
        events: events
    });    
}

function pollNewData(){
    $('#calendar').fullCalendar( 'destroy' );
    listUpcomingEvents();
}
