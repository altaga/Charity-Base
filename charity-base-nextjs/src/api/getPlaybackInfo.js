"use server";
import { Livepeer } from "livepeer";

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_APIKEY,
});

export async function getStreams() {
  const result = await livepeer.stream.getAll("<value>");
  let json = {};
  result.data.forEach((streamer) => {
    json[streamer.id] = streamer.isActive;
  });
  return json;
}

