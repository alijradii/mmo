"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuth = void 0;
const auth_1 = require("@colyseus/auth");
const setupAuth = () => {
    auth_1.auth.oauth.defaults.origin = "http://localhost:3000";
    auth_1.auth.oauth.defaults.secret = "FDKJLFKDLSJFLKJ*(FJDSK";
    auth_1.auth.oauth.addProvider('discord', {
        key: process.env.DISCORD_CLIENT_ID,
        secret: process.env.DISCORD_CLIENT_SECRET,
        scope: ['identify'],
    });
    auth_1.auth.oauth.onCallback(async (data, provider) => {
        const profile = data.profile;
        console.log(profile);
        return profile;
    });
};
exports.setupAuth = setupAuth;
