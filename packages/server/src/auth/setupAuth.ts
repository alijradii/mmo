import { auth, JWT } from "@colyseus/auth";

export const setupAuth = () => {
    auth.oauth.defaults.origin = "https://nochessnolife.cc" 
    // || "http://localhost:4070"
    auth.oauth.defaults.secret = "FDKJLFKDLSJFLKJ*(FJDSK"

    auth.oauth.addProvider('discord', {
        key: process.env.DISCORD_CLIENT_ID,
        secret: process.env.DISCORD_CLIENT_SECRET,
        scope: ['identify'],
    });
    
    auth.oauth.onCallback(async(data, provider)=> {
        const profile = data.profile; 
        console.log(profile)
        
        return profile;
    })
}