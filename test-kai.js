import { ANIME } from "@consumet/extensions";

async function test() {
  try {
    const kai = new ANIME.AnimeKai();
    const info = await kai.fetchAnimeInfo("naruto-11");
    console.log("AnimeKai Info episodes:", info.episodes?.length);
    if (info.episodes && info.episodes.length > 0) {
      const epId = info.episodes[0].id;
      console.log("AnimeKai Ep ID:", epId);
      const sources = await kai.fetchEpisodeSources(epId);
      console.log("AnimeKai Sources:", JSON.stringify(sources, null, 2));
    }
  } catch (err) {
    console.error("Error with AnimeKai:", err);
  }
}
test();
