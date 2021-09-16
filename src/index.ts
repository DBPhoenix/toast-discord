import {
  Client,
  Collection,
  ColorResolvable,
  MessageEmbed,
} from 'discord.js';
import * as fs from 'fs';
import * as Keyv from 'keyv';

import Command from './types/command';
import Event from './types/event';

import { embed as defaultEmbed } from '../data/default.json';

import * as Private from '../.private.json';

export const keyv = new Keyv();

const client = new Client({
  intents: [
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
  ],
});

export const embed = new MessageEmbed({
  ...defaultEmbed,
  color: defaultEmbed.color as ColorResolvable,
});

export const commands = new Collection<string, Command>();

const commandFiles = fs.readdirSync('./src/commands');

commandFiles.forEach((file) => {
  import(`./commands/${file}`).then((data) => {
    const command = data.default;
    commands.set(command.command.name, command);
  });
});

const eventFiles = fs.readdirSync('./src/events');

eventFiles.forEach((file) => {
  import(`./events/${file}`).then((data) => {
    const event: Event<any> = data.default;

    if (event.client) {
      if (event.once) {
        client.once(event.event, (...args) => event.execute(...args));
      } else {
        client.on(event.event, (...args) => event.execute(...args));
      }
    }
  });
});

client.login(Private.token);
