import { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { trpc } from "@utils/trpc";

export const AppRoot = () => {
  const [torrentData, setTorrentData] = useState<
    {
      amount_left: number;
      completed: number;
      dlspeed: number;
      downloaded: number;
      hash: string;
      name: string;
      size: number;
      state: string;
    }[]
  >([]);

  const { mutateAsync: getTorrentsMutateAsync } =
    trpc.controllar.torrent.getTorrents.useMutation();

  const { mutateAsync: pauseAllTorrentsMutateAsync } =
    trpc.controllar.torrent.pauseAllTorrents.useMutation();
  const { mutateAsync: pauseTorrentMutateAsync } =
    trpc.controllar.torrent.pauseTorrent.useMutation();

  const { mutateAsync: resumeAllTorrentsMutateAsync } =
    trpc.controllar.torrent.resumeAllTorrents.useMutation();
  const { mutateAsync: resumeTorrentMutateAsync } =
    trpc.controllar.torrent.resumeTorrent.useMutation();

  const { mutateAsync: deleteTorrent } =
    trpc.controllar.torrent.deleteTorrent.useMutation();

  const handleGetTorrentData = async () => {
    const res: {
      amount_left: number;
      completed: number;
      dlspeed: number;
      downloaded: number;
      hash: string;
      name: string;
      size: number;
      state: string;
    }[] = await getTorrentsMutateAsync();

    setTorrentData(() => res);
  };

  useEffect(() => {
    handleGetTorrentData();

    const refresh = setInterval(handleGetTorrentData, 3000);

    return () => {
      clearInterval(refresh);
    };
  }, []);

  return (
    <SafeAreaView>
      <Button
        onPress={async () => {
          await pauseAllTorrentsMutateAsync();
        }}
        title="Pause All"
      />
      <Button
        onPress={async () => {
          await resumeAllTorrentsMutateAsync();
        }}
        title="Resume All"
      />
      <View style={{ paddingHorizontal: 8 }}>
        {torrentData.map((torrent) => {
          return (
            <View
              key={torrent.hash}
              style={{ borderWidth: 2, marginBottom: 8 }}
            >
              <Text>{torrent.name}</Text>
              <Text>
                {Math.min(
                  Math.max((100 * torrent.downloaded) / torrent.size, 0),
                  100
                )}
                %
              </Text>
              <Text>{torrent.state}</Text>
              <Button
                onPress={async () => {
                  if (/paused/gi.test(torrent.state)) {
                    await resumeTorrentMutateAsync(torrent.hash);
                  } else {
                    await pauseTorrentMutateAsync(torrent.hash);
                  }
                }}
                title={/paused/gi.test(torrent.state) ? "Resume" : "Pause"}
              />
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
