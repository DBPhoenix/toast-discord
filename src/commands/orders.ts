import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { embed, keyv } from '..';
import Command from '../types/command';
import SessionData from '../types/session-data';

import * as Toasts from '../../data/toasts.json';

export default {
  command: new SlashCommandBuilder()
    .setName('orders')
    .setDescription('Get a list of orders.'),
  async execute(interaction: CommandInteraction) {
    const { guildId } = interaction;

    if (!guildId) {
      throw Error();
    }

    let description = 'Toast Orders:';

    const sessionData: SessionData = await keyv.get(guildId);

    const toastNames: {
      [emoji: string]: string;
    } = {};

    Toasts.forEach((toast) => toastNames[toast.emoji] = toast.name);

    Object.entries(sessionData.orders).forEach(([displayName, orders]) => {
      Object.entries(orders).forEach(([emote, amount]) => {
        description += `\n- ${amount}x ${toastNames[emote]}, ${displayName}`;
      });
    });

    if (description === 'Toast Orders:') {
      description = 'No orders yet! :c';
    }

    const copy = new MessageEmbed(embed);
    interaction.reply({
      embeds: [
        copy
          .setDescription(description),
      ],
    });
  },
} as Command;
