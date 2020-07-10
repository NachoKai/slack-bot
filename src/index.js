const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'TOKEN',
  name: 'NAME',
});

bot.on('open', () => console.log('Bot is Ready!'));

bot.on('start', () => {
  bot.postMessageToChannel('general', 'Hello world!');
});

bot.on('message', async data => {
  if (data.type !== 'message' || data.subtype == 'bot_message' || !data.text)
    return;

  const args = data.text.split(' ');
  const command = args.splice(1, 1)[0];
  const user_id = args.splice(0, 1)[0];
  const params = args.join(' ');

  console.log({ command, user_id, params });

  if (command === 'pokemon' && params) {
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${params}`
      );

      if (res.data.Response === 'False') {
        return bot.postMessageToChannel('general', 'Pokemon Not found!');
      } else {
        return bot.postMessageToChannel(
          'general',
          `*******************
           \n#${res.data.id} ${
            res.data.name.charAt(0).toUpperCase() + res.data.name.slice(1)
          }:
           \n Heigth: ${Math.round(res.data.height * 10)} cm.
           \n Weight: ${Math.round(res.data.weight / 10)} kg.
           \n${res.data.sprites.front_default}
           \n*******************
          `
        );
      }
    } catch (err) {
      console.log(err);
      bot.postMessageToChannel('general', 'Pokemon Not found!');
    }
  }
});

bot.on('error', err => {
  bot.postMessageToChannel('general', 'Error!');
  console.log(err);
});
