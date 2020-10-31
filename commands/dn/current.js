const {Command} = require('discord.js-commando');

const quests = require('../../quests.json');

module.exports = class AddBoardQuest extends Command {
  constructor(client) {
    super(client, {
      name: 'current',
      aliases: ['c'],
      group: 'dn',
      memberName: 'current',
      description: 'Show current list.',
      examples: [
        'current',
        'c',
      ],
    });
  }

  async run(msg) {
    msg.channel.startTyping();

    // formatting for embed;
    let questDisplay = ''
    if(quests.length > 0){
      quests.map((e, index) => {
        questDisplay = questDisplay + `${index+1}. ${e.region} - ${e.dungeon} (${e.owner})\n`
      });
    }else{
      questDisplay = '*No quest added*';
    }
    
    msg.channel.stopTyping();

    return msg.say('Current quests board list.',{
      'embed': {
        'title': 'Tracked Mission',
        'color': 16741688,
        'description': questDisplay,
        'footer': {
          'text': 'Board Mission Tracker',
        }
      },
    })
  }
}