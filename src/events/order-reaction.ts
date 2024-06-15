import { MessageReaction, User } from 'discord.js';
import { keyv } from '..';

import Event from '../types/event';
import SessionData from '../types/session-data';

export default {
  event: 'collect',
  client: false,
  once: false,
  async execute(reaction: MessageReaction, user: User) {
    let { dmChannel } = user;
    const { emoji, message } = reaction;

    if (!emoji.name || !message.guild) {
      throw Error();
    }

    if (!dmChannel) {
      dmChannel = await user.createDM();
    }

    const sessionData: SessionData = await keyv.get(message.guild.id);
    const displayName = message.guild.members.resolve(user)?.displayName;

    if (!displayName) {
      throw Error();
    }

    if (emoji.name == '❌') {
      let confirmation = undefined;

      while (confirmation === undefined)
      {
        await dmChannel.send('Are you sure, you want to remove your order? (y/n)');
        const responses = await dmChannel.awaitMessages({ max: 1, time: 15000 });
  
        if (responses.size === 0) {
          dmChannel.send('No response registered.');
          return;
        }

        try {
          const response = responses.first();

          if (!response) {
            throw Error();
          }

          switch (response.content) {
            case 'y':
              confirmation = true;
              break;
            case 'n':
              confirmation = false;
              break;
          }
        }
        catch {
          await dmChannel.send('I do not understand, please write y or n.');
        }
      }

      if (confirmation) {
        sessionData.orders[displayName] = {};
      }
    } else {
      let amount = 0;
      while (amount === 0) {
        await dmChannel.send('Enter order amount:');
        const responses = await dmChannel.awaitMessages({ max: 1, time: 15000 });
  
        if (responses.size === 0) {
          dmChannel.send('No response registered.');
          return;
        }
  
        try {
          const response = responses.first();
  
          if (!response) {
            throw Error();
          }
  
          amount = parseInt(response.content, 10);
        } catch {
          await dmChannel.send('I do not understand, please write a positive whole number.');
        }
      }

      if (sessionData.orders[displayName] === undefined) {
        sessionData.orders[displayName] = {};
      }

      if (sessionData.orders[displayName][emoji.name] === undefined) {
        sessionData.orders[displayName][emoji.name] = 0;
      }

      sessionData.orders[displayName][emoji.name] += amount;
  
      keyv.set(message.guild.id, sessionData);
    }
  },
} as Event<MessageReaction | User>;
