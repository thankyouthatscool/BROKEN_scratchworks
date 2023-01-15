import axios from "axios";

import { z } from "zod";

import { publicProcedure, router } from "..";

const URL = "http://192.168.0.40:9091/transmission/rpc";

const getInitialHeader = async () => {
  const res = await fetch(URL, {
    method: "POST",
  });

  const transmissionHeader = res.headers.get("x-transmission-session-id");

  return transmissionHeader!;
};

const getTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const transmissionHeader = await getInitialHeader();

    const torrentData = await axios.post(
      URL,
      {
        arguments: {
          fields: [
            "hashString",
            "id",
            "name",
            "percentDone",
            "rateDownload",
            "status",
            "totalSize",
          ],
        },
        method: "torrent-get",
      },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    const torrents = torrentData.data.arguments.torrents.map(
      (torrent: { totalSize: number }) => ({
        ...torrent,
        totalSize: torrent.totalSize.toString(),
      })
    );

    return torrents;
  });

const pauseAllTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const transmissionHeader = await getInitialHeader();

    const pauseAllTorrentsRes = await axios.post(
      URL,
      { method: "torrent-stop" },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    return pauseAllTorrentsRes.data.result as string;
  });

const pauseTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const transmissionHeader = await getInitialHeader();

    const pauseTorrentRes = await axios.post(
      URL,
      { arguments: { ids: [input] }, method: "torrent-stop" },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    return pauseTorrentRes.data.result as string;
  });

const resumeAllTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const transmissionHeader = await getInitialHeader();

    const resumeAllTorrentsRes = await axios.post(
      URL,
      { method: "torrent-start" },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    return resumeAllTorrentsRes.data.result as string;
  });

const resumeTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const transmissionHeader = await getInitialHeader();

    const resumeTorrentRes = await axios.post(
      URL,
      { arguments: { ids: [input] }, method: "torrent-start" },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    return resumeTorrentRes.data.result as string;
  });

const deleteTorrent = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const transmissionHeader = await getInitialHeader();

    const deleteTorrentRes = await axios.post(
      URL,
      {
        arguments: { ids: [input], "delete-local-data": false },
        method: "torrent-remove",
      },
      { headers: { "x-transmission-session-id": transmissionHeader } }
    );

    return deleteTorrentRes.data.result as string;
  });

export const controllarRouter = router({
  getTorrents,
  pauseAllTorrents,
  pauseTorrent,
  resumeAllTorrents,
  resumeTorrent,
  deleteTorrent,
});

(async () => {
  // const res2 = await fetch("http://192.168.0.40:9091/transmission/rpc", {
  //   method: "POST",
  //   headers: { "x-transmission-session-id": transmissionHeader! },
  // });
  // const res2J = await res2.json();
  // console.log(res2J);
  // const transmissionHeader = await getInitialHeader();
  // const res = await axios.post(
  //   URL,
  //   {
  //     arguments: {
  //       fields: [
  //         "hashString",
  //         "id",
  //         "name",
  //         "percentDone",
  //         "status",
  //         "totalSize",
  //       ],
  //     },
  //     method: "torrent-get",
  //   },
  //   { headers: { "x-transmission-session-id": transmissionHeader } }
  // );
  // console.log(res.data.arguments.torrents);
  // const pauseRes = await axios.post(
  //   URL,
  //   {
  //     arguments: { ids: ["9d004a95228f7a66078a4fb3d8a47626767ce67b"] },
  //     method: "torrent-stop",
  //   },
  //   { headers: { "x-transmission-session-id": transmissionHeader } }
  // );
  // console.log(pauseRes.data.result);
  // const resumeRes = await axios.post(
  //   URL,
  //   {
  //     arguments: { ids: ["9d004a95228f7a66078a4fb3d8a47626767ce67b"] },
  //     method: "torrent-start",
  //   },
  //   { headers: { "x-transmission-session-id": transmissionHeader } }
  // );
  // console.log(resumeRes.data);
  // const torrentRemoveRes = await axios.post(
  //   URL,
  //   { method: "torrent-remove" },
  //   { headers: { "x-transmission-session-id": transmissionHeader } }
  // );
})();
