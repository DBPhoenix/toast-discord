import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

type Command = {
  command: SlashCommandBuilder,
  execute(interaction: CommandInteraction): Promise<void>;
};

export default Command;
