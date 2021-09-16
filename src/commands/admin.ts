import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { embed, keyv } from '..';
import Command from '../types/command';

export default {
  command: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Create toast admins.')
    .addUserOption((option) => option.setName('target').setDescription('Member to become toa-wesome').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const { guild } = interaction;

    const targetUser = interaction.options.getUser('target');

    if (!guild || !targetUser) {
      throw Error('Invalid target.');
    }

    await guild.fetch();

    const sender = guild.members.resolve(interaction.user);
    const target = guild.members.resolve(targetUser);

    if (!sender || !target) {
      throw Error('This command can only be used on servers.');
    }

    if (!sender.permissions.has('ADMINISTRATOR')) {
      throw Error('You have to be administrator.');
    }

    keyv.set(target.id, { admin: true });

    const copy = new MessageEmbed(embed);
    interaction.reply({
      embeds: [
        copy
          .setDescription(`${target.displayName} just became toa-wesome!`),
      ],
    });
  },
} as Command;
