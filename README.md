# slack-meme
Slack meme integration

# Setup
* `npm install`
* Create a http://memegenerator.net account and update the `config.json`.
* Create a slack `/meme` slash command and update `slack : { token : '' }` in `config.json`.
* Create a slack `Incoming Webhook` integration and update `slack : { webhook : '' }` in `config.json`.

# Production
`forever -o ~/.forever/slackmeme.log -e ~/.forever/slackmeme.log -a start server.js`

# Development
`forever -w server.js`
