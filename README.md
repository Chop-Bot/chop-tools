# Chop Tools

Welcome to Chop Tools. A discord bot framework based on [discord.js](https://github.com/discordjs/discord.js) with commands and tasks working out of the box.

## Features

-   Commands
    -   Easy to use.
    -   Suggestion system if command not found.
    -   No configuration needed.
-   Tasks
    -   Run code on scheduled intervals.
    -   Run code on specific dates. 

## Planned Features

-   Prompter - Prompt for a user response using reactions or messages.

# Bot Example

```javascript
const ChopTools = require('chop-tools');

const client = new ChopTools.Client({ prefix: '!', owners: ['YOUR ID HERE'] });

client.on('ready', () => {
  console.log(`It's discord time! [${client.user.tag}]`);
})

client.login('YOUR TOKEN GOES HERE').then(() => {
  console.log('Login successful!');
});
```

# Creating Commands

At the entry point of your application create a directory named `commands`.
All files ending with .js in this `commands` directory will be loaded as commands.

## Command Example

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'ping',
  description: 'This is a ping command.',
  cooldown: 3,
  run(message, args, call) {
    message.channel.send('Pong!');
  }
});
```

**Notes:**

-   You can read more about the command properties on the API docs: [Command](https://chop-bot.github.io/chop-tools/latest/Command.html).
-   You can see the properties of the call object on the API docs: [CommandCall](https://chop-bot.github.io/chop-tools/latest/CommandCall.html).
-   You must export a new Command() with module.exports for it to be loaded.
-   All commands in the commands directory are loaded unless the file starts with a underscore. ( \_ )
-   You **can** have subfolders in the commands directory.
-   You can access the [client](https://chop-bot.github.io/chop-tools/latest/ChopClient.html) inside the run method by using `this.client`. (This will NOT work if `run` is a arrow function).

# API

[Documentation](http://chop-bot.github.io/chop-tools/latest/)
