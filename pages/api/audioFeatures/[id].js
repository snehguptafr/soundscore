import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
    const AUDIO_FEATURES_ENDPOINT = 'https://api.spotify.com/v1/audio-features'
    const { id } = req.query

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
  
    const getAudioAnalysis = async (refresh_token, id) => {
      const {access_token} = await getAccessToken(refresh_token);
      return fetch(`${AUDIO_FEATURES_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
      });
    };

  const {
    token: {accessToken},
  } = await getSession({req});

  const response = await getAudioAnalysis(accessToken, id);
  const {items} = await response.json();
  // console.log("id", id);
  console.log(items)
  
  if (!items){
    return res.status(500).json({msg: "no dat aheeh"})
}

  console.log(items)
  return res.status(200).json({items});
};

export default handler;