/**
 * Represents a command call.
 * @property {string} caller The id of the user that made the call.
 * @property {string} callerTag The tag of the user that made the call.
 * @property {string} callerUsername The caller's username.
 * @property {string} callerNickname The caller's nickname if they have one.
 * @property {external:Guild} guild The caller's nickname if they have one.
 * @property {Listener} listener The command for this call.
 * @property {boolean} isDM Was the command called from a dm?
 * @property {boolean} isBot Did a bot call this command?
 * @property {boolean} isAdmin Does the caller have admin permission?
 * @property {boolean} isSuperUser Is the caller a super user?
 * @property {external:Message} message The message associated with this call.
 * @property {Date} time When the command was called.
 */
class ListenerCall {
  constructor(client, listener, message) {
    this.client = client;

    this.caller = message.author.id;
    this.callerTag = message.author.tag;
    this.callerUsername = message.author.username;
    this.callerNickname = message.author.nickname;
    this.guild = message.guild;
    this.isSuperUser = this.client.options.owners.includes(this.caller);
    this.isDM = message.channel.type === 'dm';
    this.isBot = message.author.bot;
    this.message = message;
    this.time = new Date();
    this.listener = listener;
    function hasAdminPermission() {
      return message.member && message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true });
    }
    this.isAdmin = this.isSuperUser || hasAdminPermission();

  }
}

module.exports = ListenerCall;
