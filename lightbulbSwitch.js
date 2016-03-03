console.log('Loading function');

var config = {
    "thingName": 'lightbulb',
    "endpointAddress": "<PUT YOUR ENDPOINT HERE>"
}

var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({endpoint: config.endpointAddress});

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    iotdata.getThingShadow({
        thingName: config.thingName
    }, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            console.log(data);
            var jsonPayload = JSON.parse(data.payload);
            var status = jsonPayload.state.reported.status;
            console.log('status: ' + status);
            var newStatus;
            if (status == 'ON') {
                newStatus = 'OFF';
            } else {
                newStatus = 'ON';
            }
            var update = {
                "state": {
                   "desired" : {
                        "status" : newStatus
                    }
                }
            };
            iotdata.updateThingShadow({
                payload: JSON.stringify(update),
                thingName: config.thingName
            }, function(err, data) {
                if (err) {
                    context.fail(err);
                } else {
                    console.log(data);
                    context.succeed('newStatus: ' + newStatus);
                }
            });
        }
    });
};

