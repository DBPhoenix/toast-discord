type Event<T> = {
  event: string,
  client: boolean,
  once: boolean,
  execute(...args: T[]): Promise<void>
};

export default Event;
