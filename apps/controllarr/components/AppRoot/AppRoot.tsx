import { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { trpc } from "@utils/trpc";

type TorrentData = {
  hashString: string;
  name: string;
  percentDone: number;
  rateDownload: number;
  status: number;
  totalSize: string;
};

export const AppRoot = () => {
  const [torrentData, setTorrentData] = useState<TorrentData[]>([]);

  const { mutateAsync: getTorrents } =
    trpc.controllar.getTorrents.useMutation();

  // Resume torrents
  const { mutateAsync: resumeTorrent } =
    trpc.controllar.resumeTorrent.useMutation();
  const { mutateAsync: resumeAllTorrents } =
    trpc.controllar.resumeAllTorrents.useMutation();

  // Pause torrents
  const { mutateAsync: pauseTorrent } =
    trpc.controllar.pauseTorrent.useMutation();
  const { mutateAsync: pauseAllTorrents } =
    trpc.controllar.pauseAllTorrents.useMutation();

  // Delete torrent
  const { mutateAsync: deleteTorrent } =
    trpc.controllar.deleteTorrent.useMutation();

  const handleGetTorrentData = async () => {
    const res: TorrentData[] = await getTorrents();

    setTorrentData(() => res);
  };

  useEffect(() => {
    handleGetTorrentData();

    const refresh = setInterval(handleGetTorrentData, 3000);

    return () => {
      clearInterval(refresh);
    };
  }, []);

  const stateLookup = (stateCode: number) => {
    switch (stateCode) {
      case 0:
        return "Torrent is stopped";
      case 1:
        return "Torrent is queued to verify local data";
      case 2:
        return "Torrent is verifying local data";
      case 3:
        return "Torrent is queued to download";
      case 4:
        return "Torrent is downloading";
      case 5:
        return "Torrent is queued to seed";
      case 6:
        return "Torrent is seeding";
      default:
        return "Torrent is doing something.";
    }
  };

  return (
    <SafeAreaView>
      <Button
        onPress={async () => {
          await pauseAllTorrents();

          handleGetTorrentData();
        }}
        title="Pause All"
      />
      <Button
        onPress={async () => {
          await resumeAllTorrents();

          handleGetTorrentData();
        }}
        title="Resume All"
      />
      <View style={{ paddingHorizontal: 8 }}>
        {torrentData.map((torrent) => {
          return (
            <View key={torrent.hashString}>
              <Text>{torrent.name}</Text>
              <Text>
                {Number(torrent.percentDone * 100)
                  .toLocaleString(undefined, {
                    style: "percentage",
                    maximumFractionDigits: 2,
                  })
                  .split("")
                  .slice(0, 5)
                  .join("")
                  .padEnd(5, "0")}
                % @ {torrent.rateDownload}
              </Text>
              <Text>{stateLookup(torrent.status)}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  color="red"
                  onPress={async () => {
                    await deleteTorrent(torrent.hashString);
                  }}
                  title="Remove"
                />
                <Button
                  onPress={async () => {
                    if (torrent.status === 0) {
                      await resumeTorrent(torrent.hashString);
                    } else {
                      await pauseTorrent(torrent.hashString);
                    }

                    handleGetTorrentData();
                  }}
                  title={torrent.status === 0 ? "Resume" : "Stop"}
                />
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
