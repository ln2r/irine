const {Command} = require('discord.js-commando');

const dungeons = require('../../dungeons.json');
const quests = require('../../quests.json');
const fs = require('fs');

function GetMatch(query, data) {
  query = query.split(' ');
  data = data.split(' ');

  let score = 0;

  query.map((q) => {
    const req = new RegExp(`(${q})`, 'ig');
    data.map((d) => {
      if(d.match(req)){
        score++;

        // adding extra point
        if(query.length === data.length){
          score++;
        }
      }
    })
  })

  return score;
} 

module.exports = class AddBoardQuest extends Command {
  constructor(client) {
    super(client, {
      name: 'add',
      aliases: ['a'],
      group: 'dn',
      memberName: 'add',
      description: 'Add a board quest.',
      examples: [
        'a dungeon name',
        'a black lake',
      ],
    });
  }

  async run(msg, args) {

    console.log(`quests: ${quests.length}`);

    let currentQuests = (quests.length === 0)? [] : quests;
    let currentScore = 0;
    let currentHighest;

    // search the correct dungeon using "scoring" system
    console.log('Searching for match...');
    dungeons.map((r) => {
      r.dungeons.map((d) => {        
        const matchScore = GetMatch(args, d);

        console.log(`${r.region} - ${d}`);
        console.log(`current highest: ${currentScore}, matching: ${matchScore}`);

        if(matchScore >= currentScore){
          currentScore = matchScore;
          
          currentHighest = {
            region: r.region,
            dungeon: d,
            owner: `${msg.author.username}#${msg.author.discriminator}`
          }
        }
      });
    });

    console.log('Found: ');
    console.log(currentHighest);

    // only write if something is added
    if(currentHighest){
      currentQuests.push(currentHighest);

      fs.writeFile('quests.json', JSON.stringify(currentQuests, null, 2), 'utf8', (err) => {
        if (err) throw err;
      });
    }

    console.log(`Current:`);
    console.log(currentQuests);
    
    // formatting for embed;
    let questDisplay = ''
    currentQuests.map((e, index) => {
      questDisplay = questDisplay + `${index+1}. ${e.region} - ${e.dungeon} (${e.owner})\n`
    })

    return msg.say('Added new mission to the list.',{
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