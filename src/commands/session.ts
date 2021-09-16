import { CommandInteraction, EmbedField, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { embed, keyv } from '..';
import Command from '../types/command';
import SessionData from '../types/session-data';
import UserData from '../types/user-data';

import * as Toasts from '../../data/toasts.json';
import orderReaction from '../events/order-reaction';

export default {
  command: new SlashCommandBuilder()
    .setName('session')
    .setDescription('Start a new booking session.'),
  async execute(interaction: CommandInteraction) {
    const { channelId, guild, user } = interaction;

    if (!guild || !user) {
      throw Error();
    }

    await guild.fetch();

    const member = guild.members.resolve(user);

    if (!member) {
      throw Error();
    }

    const userData: UserData = await keyv.get(member.id);

    let copy = new MessageEmbed(embed);
    if (!userData || !userData.admin) {
      interaction.reply({
        embeds: [
          copy
            .setDescription('You\'re not toa-wesome!'),
        ],
        ephemeral: true,
      });

      return;
    }

    const channel = await guild.channels.fetch(channelId, { force: true });

    if (!channel?.isText()) {
      throw Error();
    }

    const fields: EmbedField[] = [];
    Toasts.forEach((toast) => {
      fields.push({
        name: `${toast.emoji} ${toast.name}`,
        value: `Price: ${toast.price}\n${toast.description}`,
        inline: true,
      });
    });

    copy = new MessageEmbed(embed);

    channel.send({
      embeds: [
        copy
          .setDescription('Book your toasts here!')
          .setFields(fields),
      ],
    })
      .then((msg) => {
        keyv.set(guild.id, { channel: msg.channelId, id: msg.id, orders: {} } as SessionData);

        const collector = msg.createReactionCollector({
          filter: (reaction, reactionUser) => !reactionUser.bot,
        });

        collector.on('collect', (reaction, reactionUser) => {
          orderReaction.execute(reaction, reactionUser).then(
            () => reaction.users.remove(reactionUser),
          );
        });

        Toasts.forEach((toast) => {
          msg.react(toast.emoji);
        });
      });

    copy = new MessageEmbed(embed);
    interaction.reply({
      embeds: [
        copy
          .setDescription('Created a new booking session!'),
      ],
      ephemeral: true,
    });
  },
} as Command;
