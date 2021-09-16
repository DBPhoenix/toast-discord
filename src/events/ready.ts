import { Client } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';

import { commands } from '..';
import Event from '../types/event';

import * as Private from '../../.private.json';

export default {
  event: 'ready',
  client: true,
  once: true,
  async execute(client: Client) {
    const { application } = client;

    if (!application) {
      throw Error('Application failed to load.');
    }

    const guildId = '641608024213028878';

    const rest = new REST({ version: '9' }).setToken(Private.token);

    await rest.put(
      Routes.applicationGuildCommands(application.id, guildId),
      { body: commands.map((command) => command.command) },
    );

    console.log('Successfully reloaded application (/) commands.');

    console.log('Ready!');
  },
} as Event<Client>;
