/**
 * The discord.js EmojiIdentifierResolvable class.
 * @external EmojiIdentifierResolvable
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/EmojiIdentifierResolvable|EmojiIdentifierResolvable}
 */

/**
 * Used to generate filters for prompts.
 * @namespace
 */
class PromptFilter {
  constructor() {
    this.allowBot = false;
    this.message = true;
    this.reaction = false;
    this.prefix = '';
    this.userId = '';
    this.emoji = [];
  }

  /**
   * Wether or not to allow bots to respond to this prompt
   * @param {Boolean} n
   * @memberof PromptFilter
   */
  bot(n) {
    this.allowBot = n;
    return this;
  }

  /**
   * Set this to true if this is a message prompt. False if its a reaction prompt.
   * @param {Boolean} n
   * @memberof PromptFilter
   */
  message(n) {
    this.message = n;
    this.reaction = !n;
    return this;
  }

  /**
   * Set this to true if this is a reaction prompt. False if its a message prompt.
   * @param {Boolean} n
   * @memberof PromptFilter
   */
  reaction(n) {
    this.reaction = n;
    this.message = !n;
    return this;
  }

  /**
   * If this is set, a message filter will only accept messages starting with this prefix.
   * @param {String} prefixToAccept
   * @memberof PromptFilter
   */
  prefix(prefixToAccept) {
    this.prefix = prefixToAccept;
    return this;
  }

  /**
   * If this is set, the filter will only accept responses from this user.
   * @param {String} id
   * @memberof PromptFilter
   */
  userId(id) {
    if (typeof id === 'string') {
      this.userId = id;
    } else if (id.id) {
      this.userId = id.id;
    }
    return this;
  }

  /**
   * If the prompt is emoji based, pass the emojis with this method.
   * @param {external:EmojiIdentifierResolvable} theEmojis
   * @memberof PromptFilter
   */
  emoji(theEmojis) {
    if (theEmojis instanceof Array) {
      this.emoji = [...theEmojis];
    } else {
      this.emoji = [theEmojis];
    }
    return this;
  }
}

module.exports = PromptFilter;

// import Discord from 'discord.js';

// /**
//  * @returns A filter to be used in the discordjs's awaitMessage method
//  */
// export const _getFilter = (
//   filterType: string,
//   options: {
//     confirm?: string | Discord.ReactionEmoji | Discord.Emoji;
//     cancel?: string | Discord.ReactionEmoji | Discord.Emoji;
//     userId?: string;
//     prefix?: string;
//     choices?: Array<string | Discord.ReactionEmoji | Discord.Emoji>;
//   },
// ) => {
//   if (!filterType) throw new Error('Missing filter type');
//   if (!options) throw new Error('Missing filter options');

//   if (filterType === 'message') {
//     return function filter(m: Discord.Message) {
//       const { prefix, userId } = options;
//       // If prefix/userId is defined compare the prefix/id
//       const rightPrefix = !prefix || m.content.startsWith(prefix);
//       const rightAuthor = !userId || m.author.id === userId;
//       return rightPrefix && rightAuthor;
//     };
//   }

//   if (filterType === 'reaction') {
//     if (!options.confirm || !options.cancel) throw new Error('Missing emoji');
//     return function filter(
//       reaction: Discord.MessageReaction,
//       user: Discord.User,
//     ) {
//       const { confirm, cancel, userId } = options;
//       // check if reaction if either confirm or cancel
//       const correctEmoji = [confirm, cancel].includes(reaction.emoji.name);
//       // If options.userId is defined campare the ids
//       const correctUser = (!userId || user.id === userId) && !user.bot;
//       return correctEmoji && correctUser;
//     };
//   }

//   if (filterType === 'vote') {
//     if (options.choices) {
//       const choices = options.choices;
//       return function filter(reaction: Discord.MessageReaction) {
//         return (
//           choices.includes(reaction.emoji.name) ||
//           choices.includes(reaction.emoji)
//         );
//       };
//     } else {
//       throw new Error('Choice filter requires options.choices');
//     }
//   }

//   if (filterType === 'choice') {
//     if (options.choices) {
//       const { choices, userId } = options;
//       return function filter(
//         reaction: Discord.MessageReaction,
//         user: Discord.User,
//       ) {
//         const correctUser = (!userId || user.id === userId) && !user.bot;
//         return (
//           correctUser &&
//           (choices.includes(reaction.emoji.name) ||
//             choices.includes(reaction.emoji))
//         );
//       };
//     } else {
//       throw new Error('Vote filter requires options.choices');
//     }
//   }

//   throw new Error('Unknown filter');
// };
