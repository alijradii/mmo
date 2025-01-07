import express from "express"
import axios from "axios"


export const authenticate = async (req: express.Request, res: express.Response) => {

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
    const CLIENT_REDIRECT = process.env.DISCORD_CLIENT_REDIRECT!

    const { code } = req.query;
    console.log(code)

    console.log(CLIENT_ID)
    console.log(CLIENT_SECRET)
    console.log(CLIENT_REDIRECT)

    try {
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code as string,
                grant_type: 'authorization_code',
                redirect_uri: CLIENT_REDIRECT,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const oauthData = tokenResponse.data;
        console.log(oauthData);

        const { access_token } = oauthData;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        console.log(userResponse.data);

        return userResponse.data;
    } catch (error) {
        // NOTE: An unauthorized token will not throw an error
        // tokenResponseData.statusCode will be 401
        console.error(error);
    }
};
