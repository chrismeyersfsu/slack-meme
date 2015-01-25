var express = require('express')
var router = express.Router()
var request = require('request')
var querystring = require('querystring')
var CmdSearch = require('../cmd/search')

/*
token=your_slack_per_cmd_token
team_id=T0001
channel_id=C2147483705
channel_name=test
user_id=U2147483697
user_name=Steve
command=/weather
text=94070
*/
function SlackMeme(Config) 	{

	function _build_message_attachments(generators, _title) {
		if (!util.isArray(generators)) {
			generators = [ generators ]
		}
		var title = _title ? _title : util.format('%d Generators Found', generators.length)
		var results = [{
				fallback: title,
				//text: 'Generators Found',
				pretext: title,
				color: 'good',
				fields: [],
		}]
		var entry = results[0].fields
		_.each(generators, function(gen) {
			entry.push({
				title: util.format('Generator Id: %d', gen.generatorID),
				value: util.format('%s', gen.instanceImageUrl || gen.imageUrl),
				short: true
			})
		})

		return results
	}

	function _build_instance_message_attachments(instance) {
		var title = util.format('%s', instance.displayName)
		var results = [{
			fallback: title,
			pretext: undefined,
			color: 'good',
			fields: [],
		}]
		var entry = results[0].fields
		entry.push({
			title: title,
			value: util.format('%s\n%s\n<%s>', instance.text0, instance.text1, instance.instanceImageUrl)
		})

		return results
	}

	// ensure the income request is as we expect
	router.use(function(req, res, next) {
		if (req.body.command != '/meme' || req.body.token != Config.slack.token || !req.body.user_name) {
			msg = util.format('Malformed request. Expected command "%s" to equal "/meme" and token "%s" to equal "%s" and username "%s" to exist', 
				req.body.command, 
				req.body.token, 
				Config.slack.token,
				req.body.username)
			console.warn(msg)
			return res.status(500).send(msg)
		} else {
			return next()
		}
	})

	router.post('/', function (req, res) {
		/* Simple split by whitespace */
		//var args = req.body.text.split(/\s+/)
		/* More complex split, treat "this has spaces", as a single arg */
		var args = req.body.text.match(/\w+|"(?:\\"|[^"])+"/g)
		/* Now remove the quotes from the begining and end of "this has spaces" */
		args = _.map(args, function(arg) {
			if (arg.charAt(0) == '"' && arg.charAt(arg.length-1) == '"') {
				arg = arg.substring(1, arg.length-1)
			}
			return arg
		})


		res.send_err_msg = function(msg) {
			console.error(util.format('/meme failed: %s', msg))
			res.status(400).send(msg)
		}

		if (args.length < 2) {
			return res.send_err_msg('I need more data than that!')
		}

		var cmd = args[0]
		var keys = Object.keys(LIB.CMD)

		async.waterfall([
			function (cb) {
				if (!_.contains(keys, cmd)) {
					return cb(new Error(util.format('command "%s" not found. Valid commands are [%s]', cmd, keys.toString())))
				}
				cb(null)
			}, function (cb) {
				LIB.CMD[cmd].exec(args, cb)
			},
		], function(err, content) {
			var my_err = Error(util.format('memegenerator.net %s failed', cmd))
		  if (err) { return res.send_err_msg(err) }

		  if (!content.success || content.success == false || !content.result) {
		  	return res.send_err_msg(my_err)
		  }

		  var packet = {
		  	channel: undefined,
		  	username: 'memebot',
		  	text: undefined,
		  	unfurl_links: true,
		  	unfurl_media: true,
		  	attachments: undefined,
		  }

		  if (cmd == 'search') {
		  	packet.channel = util.format('@%s', req.body.user_name)
				packet.attachments = _build_message_attachments(content.result)
		  } else if (cmd == 'create') {
		  	var instance = content.result
		  	if (req.body.channel_name == 'directmessage') {
		  		packet.channel = util.format('@%s', req.body.user_name)
		  	} else {
			  	packet.channel = util.format('#%s', req.body.channel_name)
			  }
		  	packet.text = util.format('<%s>', instance.instanceImageUrl)
		  	packet.attachments = _build_instance_message_attachments(instance)
		  }

		  LIB.slack.webhook(packet, function(err, response) { /* do nothing here */ })
			return res.send('Working on building your meme. Upon completion it will be posted in this channel.')
		})
	})

	return router
}
module.exports = SlackMeme
