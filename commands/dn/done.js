const {Command} = require('discord.js-commando');

const quests = require('../../quests.json');
const fs = require('fs');

module.exports = class AddBoardQuest extends Command {
  constructor(client) {
    super(client, {
      name: 'done',
      aliases: ['d'],
      group: 'dn',
      memberName: 'done',
      description: 'Delete a quest from the list.',
      examples: [
        'd index',
        'd 1',
      ],
    });
  }

  async run(msg, args) {

    if(args > quests.length){
      return msg.say(`Invalid, max quest selected number: ${quests.length+1}`);
    }

    // removing the selected quest
	if(quests.length == 1){
		quests.pop();
	} else {
		quests.splice(args-1, 1);
	}
	
    const currentQuests = quests;
    console.log('Current:');
    console.log(currentQuests);

    fs.writeFile('quests.json', JSON.stringify(currentQuests, null, 2), 'utf8', (err) => {
      if (err) throw err;
    });

    // formatting for embed
    let questDisplay = ''
    if(quests.length > 0){
      quests.map((e, index) => {
        questDisplay = questDisplay + `${index+1}. ${e.region} - ${e.dungeon} (${e.owner})\n`
      });
    }else{
      questDisplay = '*No quest added*';
    }

    return msg.say('Removed a mission from the list.',{
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