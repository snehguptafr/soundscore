import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
    const RECENT_SONG_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'
  
    const getAccessToken = async (refresh_token) => {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token,
        }),
      });
    
      return response.json();
    };
  
    const getUsersRecentSong = async (refresh_token) => {
      const {access_token} = await getAccessToken(refresh_token);
      return await fetch(RECENT_SONG_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    };

  const {
    token: {accessToken},
  } = await getSession({req});

  const response = await getUsersRecentSong(accessToken);
  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;