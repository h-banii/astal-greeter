// TODO: Add more APIs and select them through State+config
export default {
  NekosAPI: (rating: string[] = []) =>
    rating.length > 0
      ? `https://api.nekosapi.com/v4/images/random/file?rating=${rating.join(",")}`
      : `https://api.nekosapi.com/v4/images/random/file`,
};
