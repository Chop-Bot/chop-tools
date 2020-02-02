# Welcome To Chop Tools

This guide will get you started with Chop Tools.

## Installing chop-tools

```shell
npm install chop-tools
```

## A simple bot

First, create a discord application and get a bot token [here](https://discordapp.com/developers/applications/).

```javascript
// index.js
const { Client } = require('chop-tools');

const client = new Client({
  prefix: '!',
  owners: ['your id here'],
});

client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
});

client.login('your bot token goes here');
```

That is all you need to have your bot online. The next step is [Creating Commands](./tutorial-02%20-%20Creating%20Commands.html)
