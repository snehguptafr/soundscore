import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Clock from 'react-live-clock';
import { useSession, signIn, signOut, } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Embed from 'react-embed';
import Spotify from 'react-spotify-embed'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { LinkPreview } from '@dhaiwat10/react-link-preview';


const Home: NextPage = () => {

  const [userData, setUserData] = useState()
  const [nowPlaying, setNowPlaying] = useState()
  const [recentSongs, setRecentSongs] = useState()
  const [topTracks, setTopTracks] = useState()
  const [topArtists, setTopArtists] = useState()
  const [audioFt, setAudioFt] = useState()

  const { data: session } = useSession()
  

  const getRecentlyPlayed = async () => {
    const res = await fetch('/api/recentSongs');
    const { items } = await res.json();
    setRecentSongs(items);
  };

  const getCurrentlyPlaying = async () => {
    const res = await fetch('/api/nowPlaying');
    const { items } = await res.json();
    setNowPlaying(items);
  };

  const getTopArtists = async () => {
    const res = await fetch('/api/topArtists');
    const { items } = await res.json();
    setTopArtists(items);
  };

  const getTopTracks = async () => {
    const res = await fetch('/api/topSongs');
    const { items } = await res.json();
    setTopTracks(items);
  };

  const getAudioFeatures = async (id: undefined) => {
    const res = await fetch(`/api/audioFeatures/${id}`);
    const { items } = await res.json();
    setAudioFt(items);
    console.log(audioFt)
  }

  useEffect(() => {
    setUserData(session?.session?.user)
    getRecentlyPlayed()
    // getCurrentlyPlaying()
    getTopArtists()
    getTopTracks()
  }, [])

  return (

    <div className='w-9/12 mx-auto my-auto'>

      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/blocks.css/dist/blocks.min.css" />
      </Head>

      <header className="grid lg:grid-cols-3 grid-cols-1 bg-[#A6BB8D] p-8 radius border-2 border-black rounded-[20px] mt-8">

        <div className='col-span-1  flex justify-start items-center'>
          <span className='box-border mr-2  rounded-[50%] hover:motion-safe:animate-spin border-black bg-[#D9D9D9] border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.25)]'>
            <img className='w-10 rounded-[50%]' src={session?.session?.user?.image} alt="" />

          </span>
          <span className='box-border font-bold font-mono p-[10px_20px] rounded-[10px] border-black bg-[#D9D9D9] border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.25)]'>
            {session?.session?.user?.name}
          </span>
        </div>

        {/* APP NAME */}
        <div className='col-span-1 font-mono italic text-5xl subpixel-antialiased font-bold text-center truncate'>SoundScore</div>

        <div className="col-span-1 flex justify-end items-center">
          <button 
          className='box-border font-mono p-[10px_20px] rounded-[10px] border-black bg-[#D9D9D9] border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.25)]'
          onClick={() => session ? signOut() : signIn()}
          >
            {session ? "sign out" : "sign in"}
          </button>
        </div>

      </header>

      <main className='gap-4 grid grid-col-2 col-span-3 bg-[#A6BB8D] p-8 radius border-2 border-black rounded-[20px] mt-2'>

        {/* <div 
          className='text-center lg:col-span-1 row-span-1 box-border border-2 my-auto mx-auto p-2 bg-[#D9D9D9] border-black rounded-[20px] shadow-[6px_6px_0px_rgba(0,0,0,0.25)]'> */}
          
            {recentSongs && 
              <div className="p-0 m-0 col-span-1">
                <Spotify height="100%" width="95%" link={recentSongs[0]?.track.external_urls.spotify}/>
              </div>
            }
            <div className="col-span-1">
            <Carousel showArrows={true} dynamicHeight={false} autoPlay showThumbs={false} showIndicators={false}>
            <div key="slide1">
            {topTracks && <div>
                 <Spotify link={topTracks[0]?.external_urls?.spotify}/>
              </div>}
            </div>
            <div key="slide2">
            {topTracks && <div>
                 <Spotify link={topTracks[1]?.external_urls?.spotify}/>
              </div>}
            </div>
            <div key="slide3">
            {topTracks && <div>
                 <Spotify link={topTracks[2]?.external_urls?.spotify}/>
              </div>}
            </div>
          </Carousel>
        </div>
            {/* {recentSongs && <LinkPreview url={recentSongs[0]?.track.external_urls.spotify} width='400px' />} */}
            {/* <span className="text-center">currently playing</span> */}
          
          
        {/* </div> */}

        <div className='col-span-2
        box-border  
        border-2 bg-[#D9D9D9] 
        border-black 
        rounded-[20px] 
        shadow-[6px_6px_0px_rgba(0,0,0,0.25)]'>
{          recentSongs && <button className="btn" onClick={() => getAudioFeatures(recentSongs[0]?.track?.id)}>get special data for current song</button>
}        </div>
       
       


       
        <div className='col-span-1
        box-border  
        border-2 bg-[#D9D9D9] 
        border-black 
        rounded-[20px] 
        shadow-[6px_6px_0px_rgba(0,0,0,0.25)]
        my-auto mx-auto'>
         
          <Carousel width="100%" showArrows={true} dynamicHeight={false} autoPlay showThumbs={false} showIndicators={false}>
            <div className='p-5 border-radius-[20]' key="slide1">
              <img className='p-5' src={topArtists && topArtists[0]?.images[0]?.url} />
              <span>{<a href={topArtists && topArtists[0]?.external_urls?.spotify}>{topArtists && topArtists[0]?.name}</a>}</span>
            </div>
            <div className='p-5 border-radius-[20]' key="slide2">
              <img className='p-5' src={topArtists && topArtists[1]?.images[0]?.url} />
              <span>{topArtists && topArtists[1]?.name}</span>
            </div>
            <div className='p-5 border-radius-[20]' key="slide3">
              <img className='p-5' src={topArtists && topArtists[2]?.images[0]?.url} />
              <span>{topArtists && topArtists[2]?.name}</span>
            </div>
          </Carousel>
        </div>
        


        

      </main >

    </div>
    
  )
}


export default Home
