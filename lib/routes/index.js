var SlackMeme = require('./slack_meme')

module.exports = function(Config, app) {
	app.use('/api/v1/slackmeme', new SlackMeme(Config))
};