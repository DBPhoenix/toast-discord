import { Interaction, MessageEmbed } from 'discord.js';

import { commands, embed } from '..';
import Event from '../types/event';

export default {
  event: 'interactionCreate',
  client: true,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    if (!interaction.guild) {
      const copy = new MessageEmbed(embed);

      interaction.reply({
        embeds: [
          copy
            .setDescription('This bot is only meant for use in a guild.'),
        ],
      });

      return;
    }

    command.execute(interaction)
      .catch((err) => {
        const copy = new MessageEmbed(embed);

        interaction.reply({
          embeds: [
            copy
              .setDescription(`An error occurred:\n${err.message}`),
          ],
        });

        console.error(err);
      });
  },
} as Event<Interaction>;
