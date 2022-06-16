import { Difficulty } from "../../types";

export const game = {
  getGrid: async (difficulty: Difficulty) => {
    const endpoint =
      process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_API_URL_LOCAL}/grid`
        : `${process.env.REACT_APP_API_URL}/grid`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty }),
    });
    // TODO: handle errors

    const data = await res.json();

    return data.grid;
  },
};
