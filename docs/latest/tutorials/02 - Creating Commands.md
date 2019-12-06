# Commands

Chop Tools supports commands out of the box. To begin using commands, set your prefix on the client constructor and place your commands in a directory named `commands` in the same level as your `index.js`.

**Note:** You can see all the properties a command can have [on the api docs](./Command.html).

## Examples

The file structure

-   src/

    -   index.js
    -   commands/

        -   hello.js
        -   hearts.js
        -   secret.js
        -   avatar.js
        -   extra-cool-commands/

            -   cute.js
            -   roll.js
            -   shrug.js

### index.js

```javascript
const { ChopClient } = require('chop-tools');

const client = new ChopClient({
  prefix: '!',
  owners: ['your id here'],
});

client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
});

client.login('your bot token goes here');
```

### hello.js

Your bot will say hello to you.

-   Usage: !hello
-   Alias: !hi

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'hello',
  description: 'Says hello back to you.',
  category: 'greeting',
  aliases: ['hi'],
  run(message, args, call) {
    message.channel.send(`Hello ${message.author}!`);
  },
});
```

### hearts.js

How many heart emojis are there?

-   Usage: !hearts
-   Alias: !heart

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'hearts',
  description: 'How many heart emojis are there?',
  category: 'funny',
  aliases: ['heart'],
  run(message, args, call) {
    message.channel.send(`💓💛!`);
  },
});
```

### secret.js

You can only use this command if your id is in the owners array. See [ChopOptions](./global.html#ChopOptions).

-   Usage: !secret
-   Alias: !s
-   Only the bot owner can use it.
-   The message will get deleted.

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'secret',
  description: 'You can only use this command if your id is in the owners array.',
  category: 'admin',
  aliases: ['s'],
  delete: true,
  hidden: true,
  run(message, args, call) {
    message.author.send("You can use hidden commands and thats cool!");
  },
});
```

### avatar.js

Shows someone's profile picture.

-   Usage: !avatar @TheirName
-   Alias: !pfp
-   Requires an argument.
-   Has a 30 second cooldown.

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'avatar',
  description: "Shows someone's profile picture.",
  category: 'funny',
  aliases: ['pfp'],
  args: ['target'],
  usage: '@mention',
  examples: ['@Bob#0001', '@Lar#9547', '@Adorabubs#8888'],
  cooldown: 30,
  run(message, args, call) {
    const target = message.mentions.members.first();
    if (!target) {
      message.channel.send("I couldn't find that person.");
      return;
    }

    const avatarURL = target.user.displayAvatarURL({ size: 512 });

    message.channel.send(`This is ${target}'s avatar. Aren't they pretty?\n${avatarURL}`);
  },
});
```

### cute.js

Secretly tell someone they're cute.

-   Usage: !cute @TheirName
-   Sends the message to DM.
-   Requires an argument.

```javascript
const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'cute',
  description: "Tell someone they're cute.",
  category: 'funny',
  args: ['target'],
  usage: '@mention',
  example: '@Tina#0001',
  delete: true,
  run(message, args, call) {
    const target = message.mentions.members.first();
    if (!target) {
      message.channel.send("I couldn't find that person.");
      return;
    }

    target.send(`Hey there, ${call.callerTag} said you're cute. ;)`);
  },
});
```

### roll.js

Rolls a die.

-   Usage: !roll [sides]
-   Aliases: !die !dice

```javascript
const { Command, Random } = require('chop-tools');

module.exports = new Command({
  name: 'roll',
  description: "Rolls a die.",
  category: 'funny',
  usage: '[sides]',
  examples: ['', '6', '10'],
  run(message, args, call) {
    const arg = Math.floor(Math.abs(args[0]));

    let sides;

    if (Number.isNaN(arg) || arg === 0 || arg > 100) {
      sides = 6;
    } else {
      sides = arg;
    }

    const roll = Random.number(1, sides);

    target.send(`${message.author} rolled a **${roll}**!`);
  },
});
```

### shrug.js

Shrug.

-   Usage: !shrug
-   Aliases: !meh

```javascript
const { Command, Random } = require('chop-tools');

module.exports = new Command({
  name: 'shrug',
  description: "Shrug.",
  category: 'funny',
  aliases: ['meh'],
  delete: true,
  run(message, args, call) {
    message.channel.send('¯\\_(ツ)_/¯');
  },
});
```

If you are already familiar with commands you should read [More on Commands](./tutorial-03%20-%20More%20on%20Commands.html).
