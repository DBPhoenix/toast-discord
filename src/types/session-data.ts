// key = guildId
type SessionData = {
  channel: string;
  id: string;
  orders: {
    [customer: string]: {
      [emoji: string]: number,
    },
    /*
    [emoji: string]: {
      [customer: string]: number,
    },
    */
  },
};

export default SessionData;
