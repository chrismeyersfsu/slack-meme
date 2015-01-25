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

# Usage
`/meme create "search string" "top text" "bottom text"` will create a meme and post it to the channel you are currently in. If you are in a direct message then the meme will be direct messaged to you from `slackbot`.

For example:
```
/meme create "most interesting" "I don't always post memes, but when I do" "I use slackmeme"
```
