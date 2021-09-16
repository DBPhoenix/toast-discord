// key = guildId
type SessionData = {
  channel: string;
  id: string;
  orders: {
    [emoji: string]: {
      [customer: string]: number,
    },
  },
};

export default SessionData;
