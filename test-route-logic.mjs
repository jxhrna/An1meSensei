import { ANIME } from "@consumet/extensions";

async function test() {
  try {
    const kai = new ANIME.AnimeKai();
    console.log("Searching AnimeKai for Naruto...");
    const searchRes = await kai.search("Naruto");
    if (!searchRes.results.length) return console.log("No kai results");
    const animeId = searchRes.results[0].id;
    console.log("Kai Result ID:", animeId);
    
    const kaiInfo = await kai.fetchAnimeInfo(animeId);
    console.log("Kai Info title:", kaiInfo.title);
    
    if (kaiInfo?.episodes?.length) {
      console.log("First Kai Episode ID:", kaiInfo.episodes[0].id);
      
      const epIdStr = kaiInfo.episodes[0].id;
      console.log("Episode ID string:", epIdStr);
      const parts = epIdStr.split("$");
      const slug = parts[0];
      const epStr = parts.find((p) => p.startsWith("ep="))?.split("=")[1] || "1";
      const epNum = parseInt(epStr);
      
      console.log({ slug, epNum });
      
      console.log("Fetching AnimeKai info for slug:", slug);
      const slugInfo = await kai.fetchAnimeInfo(slug);
      console.log("Extracted title for pahe search:", slugInfo.title);
    }
  } catch (err) {
    console.error("Error!!!", err.message);
  }
}
test();
