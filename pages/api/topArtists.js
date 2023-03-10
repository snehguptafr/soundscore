import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
    const TOP_ARTIST_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists'
    // const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks'

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
  
    const getUsersTopArtists = async (refresh_token) => {
      const {access_token} = await getAccessToken(refresh_token);
      return fetch(TOP_ARTIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          time_range: "short_term"
        },
      });
    };

  const {
    token: {accessToken},
  } = await getSession({req});

  const response = await getUsersTopArtists(accessToken);
  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;