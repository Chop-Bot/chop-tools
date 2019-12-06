# More on Commands

This page will tell you about more advanced command features. Use them to empower and make your bot unique.

## Commands in DMs

Commands in DMs are disabled by default. You can enable them by setting `dmCommands` to `allow` when instantiating a new client. See [ChopOptions](./global.html#ChopOptions).

### dm.js

-   Usage: !dm
-   Aliases: !directmessage
-   Works in DMs.

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'dm',
  description: 'This command works in DM.',
  category: 'testing',
  aliases: ['directmessage'],
  // This will make this command work in DMs.
  runIn: ['dm'],
  run(message, args, call) {
    message.author.send(`Hello there ${message.author}, how can I help you?`);
  },
});
```

## Arguments of the Run function

Your command's `run` function will receive 3 arguments: the message object, the arguments the user used and the [call object](./CommandCall.html).

### message

See [Message](https://discord.js.org/#/docs/main/master/class/Message).

### args

Assuming your prefix is `!` and you have a command named `today` and the user uses it as `!today i'm happy` the value for `args` will be the following array: `["i'm", "happy"]`.
On the previous page, the roll command used the first arg as the number of sides for the dice roll.

### call

The call object contain useful information about this command call and can be modified by command middleware. See [CommandCall](./CommandCall.html) for a list of available properties.

## Run function behavior

The run function will be called whenever someones uses its command.

### Function vs Arrow

After your command is loaded by chop-tools it gets assigned a property `client` with the current client. You can access this client in the run function with `this.client`. But it will not work if run is a arrow function.

```javascript
// this works
const run = function () {
  console.log(this.client.user.tag) // -> YourAwesomeBot#1234
}

// this also works, but no this.client
const run = () => console.log(this.client); // -> undefined

// If you're not planning on using this.client anyway you can do something like:
module.exports = new Command({
  name: 'ping',
  description: 'pong',
  category: 'testing',
  run: m => m.reply('pong'),
});
```

### Async/Await

Async functions for run are supported.

```javascript
const { Command } = require('chop-tools');

// Resolves after t milliseconds.
const wait = t => new Promise(r => setTimeout(r, t));

module.exports = new Command({
  name: 'lucky',
  description: 'What is your lucky number?',
  category: 'funny',
  async run(message, args, call) {
    // A random number.
    const luckyNumber = Math.round(Math.random() * 100);
    // Sends the message. See discord.js's TextChannel.send().
    const msg = await channel.send('Your lucky number is...');
    // Waits for a second.
    await wait(1000);
    // Edits the message to add the lucky number.
    msg.edit(`${msg.content} **${luckyNumber}**!!`);
  },
});
```

## Middleware

TODO: Write middleware documentation. @_@ ;-;

TODO: Check wether these middleware support async functions. >_<

```javascript
client.use((call, next) => {
  const time = new Date().toLocaleTimeString();
  const tag = call.callerTag;
  const content = call.message.content;
  const guild = call.message.guild.name;
  // logs command usage
  console.log(`[${time}] ${tag}: ${content} | (${guild})`);
  // will output something like:
  // [05:56:00] Someone#1234: !coolcommand 123 | (Cool Guild Name)
  next();
});
```
