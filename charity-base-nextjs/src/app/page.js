"use client";
import { getStreams } from "@/api/getPlaybackInfo";
import { getStreamers } from "@/api/userData";
import React from "react";
import StreamerContainer from "./components/streamerContainer";
import StreamerContainerTitle from "./components/streamerContainerTitle";
import 'hls-video-element';

export default function Home() {
  const [streamers, setStreamers] = React.useState([]);

  async function setup() {
    const [users, streams] = await Promise.all([getStreamers(), getStreams()]);
    const streamers = users.map((user) => {
      return {
        ...user,
        online: streams[user.streamID] ?? false,
      };
    });
    setStreamers(streamers);
  }

  React.useEffect(() => {
    setup();
  }, []);

  return (
    <div className="container">
      <div className="side-bar">
        <h5
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          RECOMMENDED CHANNELS
        </h5>
        {streamers.map((streamer, i) => {
          return <StreamerContainer key={i} {...streamer} />;
        })}
      </div>
      <div className="home-container">
        {streamers?.map((streamer, i) => (
          <div key={i} className="video-container">
            {streamer.online ? (
              <hls-video
                src={`https://livepeercdn.studio/hls/${streamer.streamURL}/index.m3u8`}
                height="200px"
                width="auto"
                controls
              />
            ) : (
              <video height="200px" width="auto" controls>
                <source src={streamer.defaultSession} />
              </video>
            )}
            <StreamerContainerTitle {...streamer} />
          </div>
        ))}
      </div>
    </div>
  );
}
