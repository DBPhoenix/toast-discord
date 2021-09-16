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

    const sessionData: SessionData = await keyv.get(message.guild.id);
    const displayName = message.guild.members.resolve(user)?.displayName;

    if (!displayName) {
      throw Error();
    }

    if (sessionData.orders[emoji.name] === undefined) {
      sessionData.orders[emoji.name] = {};
    }

    if (sessionData.orders[emoji.name][displayName] === undefined) {
      sessionData.orders[emoji.name][displayName] = 0;
    }

    sessionData.orders[emoji.name][displayName] += amount;

    keyv.set(message.guild.id, sessionData);
  },
} as Event<MessageReaction | User>;
