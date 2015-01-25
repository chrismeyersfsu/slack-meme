var IndexRoutes = require('./routes/index')
var _ = require('lodash')
var CmdSearch = require('./cmd/search')
var CmdCreate = require('./cmd/create')
var Slack = require('slack-node')

function globalizeLibraries(libs) {
	_.each(libs, function(lib) {
		if (lib instanceof Object) {
			global[lib.nickname] = require(lib.lib)
		} else {
			global[lib] = require(lib)
		}
	})
}

module.exports = function(Config, app) {
	globalizeLibraries([
		'async', 
		{ nickname: '_', lib: 'lodash' }, 
		'util'
	])
	var self = this;
	self.routes = new IndexRoutes(Config, app)
	self.cmds = []
	self.cmds.search = new CmdSearch(Config)

	// Expose the cmds
	LIB = {}
	LIB.CMD = []
	LIB.CMD['search'] = new CmdSearch(Config)
	LIB.CMD['create'] = new CmdCreate(Config)

	LIB.slack = new Slack();
	LIB.slack.setWebHook(Config.slack.webhook);

	global['LIB'] = LIB
}