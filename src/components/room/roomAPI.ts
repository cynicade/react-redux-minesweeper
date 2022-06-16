import { IMember } from "../../types";

export const getMembers = async (roomId: string): Promise<Array<IMember>> => {
  const data = await fetch(
    process.env.REACT_APP_API_URL_LOCAL + "/members/" + roomId
  );
  return data.json();
};
