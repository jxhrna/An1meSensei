import fs from 'fs';

async function test() {
  const m3u8Req = await fetch("http://localhost:3000/api/proxy?url=https%3A%2F%2Fvault-01.uwucdn.top%2Fstream%2F01%2F11%2F41db5d4603e8ed1374f852d3300390d19686ed5fb636916df4063dabebef4036%2Fuwu.m3u8&referer=https%3A%2F%2Fkwik.cx%2F");
  const m3u8 = await m3u8Req.text();
  console.log("M3U8 fetched.");
  
  const lines = m3u8.split("\n");
  const segmentUrls = lines.filter(l => l.startsWith("/api/proxy"));
  console.log("Found", segmentUrls.length, "segments");
  
  for (let i = 0; i < Math.min(5, segmentUrls.length); i++) {
    const url = "http://localhost:3000" + segmentUrls[i];
    console.log("Fetching segment", i + 1, "...");
    const segReq = await fetch(url);
    console.log("Segment", i + 1, "status:", segReq.status, "content-type:", segReq.headers.get("content-type"));
    if (segReq.status !== 200) {
      console.log("Error body:", await segReq.text());
    } else {
      const buf = await segReq.arrayBuffer();
      console.log("Segment size:", buf.byteLength);
    }
  }
}
test().catch(console.error);
