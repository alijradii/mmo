import { auth, JWT } from "@colyseus/auth";

export const setupAuth = () => {
  auth.oauth.defaults.origin = process.env.SERVER_ORIGIN
  // "http://localhost:4070";
  // "https://nochessnolife.cc";
  auth.oauth.defaults.secret = "FDKJLFKDLSJFLKJ*(FJDSK";
  
  if(!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) 
    throw new Error(".env DISCORD_CLIENT info not found.")

  auth.oauth.addProvider("discord", {
    key: process.env.DISCORD_CLIENT_ID,
    secret: process.env.DISCORD_CLIENT_SECRET,
    scope: ["identify"],
  });

  auth.oauth.onCallback(async (data, provider) => {
    const profile = data.profile;
    console.log(profile);

    return profile;
  });
};
