import { ANIME } from "@consumet/extensions";

async function test() {
  try {
    const pahe = new ANIME.AnimePahe();
    console.log("Searching AnimePahe for Naruto...");
    const res = await pahe.search("Naruto");
    console.log("Search Result ID:", res.results[0].id);
    
    console.log("Fetching Info...");
    const info = await pahe.fetchAnimeInfo(res.results[0].id);
    console.log("Info episodes count:", info.episodes?.length);
    
    if (info.episodes?.length) {
      console.log("Fetching Sources for:", info.episodes[0].id);
      const sources = await pahe.fetchEpisodeSources(info.episodes[0].id);
      console.log("Sources:", sources);
    }
  } catch (err: any) {
    console.error("Error!!!", err.message);
  }
}
test();
