# ⚠️ Deprecated ⚠️

MessageQuote is no longer under development (End of Life)

As long as nodejs v16 and discord.js v13 (Discord API v10) are available, the current build of MessageQuote will continue to function

It may not work in the future depending on the state of the Discord API, but the developer will not take any responsibility. Please understand

----

# MessageQuote

[![Auto Pull Request Labeler](https://github.com/approvers/MessageQuote/actions/workflows/auto-label.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/auto-label.yml)
[![GitHub Actions#CodeQL](https://github.com/approvers/MessageQuote/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/codeql-analysis.yml)

[![GitHub Actions#eslint](https://github.com/approvers/MessageQuote/actions/workflows/eslint.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/eslint.yml)
[![GitHub Actions#prettier](https://github.com/approvers/MessageQuote/actions/workflows/prettier.yml/badge.svg)](https://github.com/approvers/MessageQuote/actions/workflows/prettier.yml)

----

# 🚶 Setup

```sh 
docker build ./ -t message-quote
docker run --env-file ./.env message-quote
```

If you do not use Docker, you can follow the steps below to set up using pm2

```sh 
yarn
yarn build
yarn setup
```

For daemon management using pm2, check the [pm2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

## ✨ How use

When you send a message link on a channel where MessageQuote is participating and you have permission to view and send messages, MessageQuote will return the message of that message link as Embed

![Quote](https://cdn.discordapp.com/attachments/919569576939896832/981514025361887282/unknown.png)

## 🔧 Config (env)

Environment variables required to start MessageQuote. Register it in the shell or place it on the root directory

### `DISCORD_TOKEN` - required

Specify the token of the Bot user with whom MessageQuote will connect

### `SKIP_PREFIX` - required

Specifies the Prefix to be specified for through without citation

It also works as a prefix for the ping command
