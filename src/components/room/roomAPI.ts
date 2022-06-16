export const room = {
  getMembers: async (roomId: string) => {
    const endpoint =
      process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_API_URL_LOCAL}/members/${roomId}`
        : `${process.env.REACT_APP_API_URL}/grid/${roomId}`;

    const res = await fetch(endpoint);
    const data = await res.json();
    return data.members;
  },
};
