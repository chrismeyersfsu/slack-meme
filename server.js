var IndexLib = require('./lib/index')

var express = require('express')
var bodyParser = require('body-parser');
var app = express()

var Config = require('./config.json')
/*
{
	"http": {
		"port": 80
	},
	"memegenerator": {
		"username": "",
		"password": "",
		"baseUrl": "http://version1.api.memegenerator.net"
	},
	"slack": {
		"token": "",
		"webhook": "https://hooks.slack.com/services/..."
	}
}
*/

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('port', Config.http.port)
var lib = new IndexLib(Config, app)
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port)
})