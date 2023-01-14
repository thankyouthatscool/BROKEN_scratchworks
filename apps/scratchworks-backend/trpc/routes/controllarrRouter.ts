import api from "qbittorrent-api-v2";
import { z } from "zod";

import { publicProcedure, router } from "..";

let client: api.QBittorrentApiEndpoint;

(async () => {
  const username = process.env.QBITTORENT_USERNAME!;
  const password = process.env.QBITTORENT_PASSWORD!;

  client = await api.connect("http://192.168.0.40:8080", username, password);
})();

const getTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    try {
      const torrents = await client.torrents();

      const res = torrents.map(
        ({
          amount_left,
          completed,
          dlspeed,
          downloaded,
          hash,
          name,
          size,
          state,
        }) => ({
          amount_left,
          completed,
          dlspeed,
          downloaded,
          hash,
          name,
          size,
          state,
        })
      );

      return res;
    } catch {
      return [];
    }
  });

const pauseAllTorrents = publicProcedure
  .input(z.string().optional())

  .mutation(async () => {
    const r = (await client.torrents()).map((torrent) => torrent.hash);

    await Promise.all(r.map((hash) => client.pauseTorrents(hash)));

    return "OK";
  });

const pauseTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    await client.pauseTorrents(input);

    return "OK";
  });

const resumeAllTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const r = (await client.torrents()).map((torrent) => torrent.hash);

    await Promise.all(r.map((hash) => client.resumeTorrents(hash)));

    return "OK";
  });

const resumeTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    await client.resumeTorrents(input);

    return "OK";
  });

const deleteTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    console.log(input);

    await client.deleteTorrents(input, false);

    return "OK";
  });

const torrent = router({
  getTorrents,
  pauseAllTorrents,
  pauseTorrent,
  resumeAllTorrents,
  resumeTorrent,
  deleteTorrent,
});

export const controllarRouter = router({ torrent });
