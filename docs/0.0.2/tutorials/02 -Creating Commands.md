# Commands

Chop Tools supports commands out of the box. To begin using commands, set your prefix on the client constructor and place your commands in a directory named `commands` in the same level as your `index.js`.

### ⚠ Important

You can see all the properties a command can have [on the api docs](./Command.html).

## Examples

The file structure

- src/
  - index.js
  - commands/
    - hello.js
    - math.js
    - hearts.js
    - secret.js
    - avatar.js

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
- Usage: !hello
- Alias: !hi

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

### hello.js

Your bot will say hello to you.
- Usage: !hello
- Alias: !hi

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