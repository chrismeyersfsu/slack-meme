var express = require('express')
var request = require('request')
var querystring = require('querystring')

function exec(args, cb) {
	console.log(util.format('Searching for %s', args[1]))
	var query = {
		q: args[1],
		pageIndex: 0,
		pageSize: 5 
	}
	var url = this.Config.memegenerator.baseUrl + '/Generators_Search?' + querystring.stringify(query);
	console.info(util.format('search url %s', url))
	request.get(url, function (err, response, body) {
		var my_err = Error('meme search failed')
		if (err) { return cb(err) }
	  if (response.statusCode != 200) { return cb(my_err) }

	  return cb(null, JSON.parse(body))
	});
}

function CmdSearch(Config) {
	this.Config = Config
}

CmdSearch.prototype.exec = exec
module.exports = CmdSearch
