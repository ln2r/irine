const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');

const clientDiscord = new CommandoClient({
  commandPrefix: config.prefix,
  owner: config.authors,
  disableEveryone: true,
  unknownCommandResponse: false,
});

clientDiscord.login(config.auth);

clientDiscord.registry
  .registerDefaultTypes()
  .registerGroups([
    ['dn', 'DragonNest'],
    ['utils', 'Utility'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

  clientDiscord
  .on('error', (error) => {
    services.sendLog('error', 'Discord', error);
  })
  .on('warn', (warn) => {
    services.sendLog('warn', 'Discord', warn);
  })
// remove "//" below to enable debug log
// .on('debug', console.log)
  .on('disconnect', () => {
    console.log('Disconnected.');  })
  .on('reconnecting', () => {
    console.log('Reconnecting.');  })
  .on('ready', async () => {
    console.log('Bot started.');
    clientDiscord.user.setPresence({
      activity: {
        name: 'your requests.',
        type: 'LISTENING',
      },
      status: 'online'
    })
  })
  .on('commandError', (error, command, message) => {
    console.log(`Error occured: ${error.name}:${command.name}\n${message}`)
  });