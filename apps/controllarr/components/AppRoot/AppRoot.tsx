import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Checkbox from "expo-checkbox";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressBar } from "@components/ProgressBar";
import { TorrentData } from "@types";
import { getLSTorrentData, setLSTorrentData } from "@utils/localStorage";
import { trpc } from "@utils/trpc";

const { height } = Dimensions.get("window");

export const AppRoot = () => {
  const initialLoadRef = useRef<boolean>(false);

  const [torrentData, setTorrentData] = useState<TorrentData[]>([]);
  const [autoPause, setAutoPause] = useState<boolean>(false);

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
    if (!initialLoadRef.current) {
      const lsData = await getLSTorrentData();

      setTorrentData(() => lsData);
    }

    const res: TorrentData[] = await getTorrents();

    initialLoadRef.current = true;

    setLSTorrentData(res);

    setTorrentData(() => res);
  };

  const handlePauseAllTorrents = async () => {
    console.log("Pausing all torrents");

    await pauseAllTorrents();
  };

  useEffect(() => {
    handleGetTorrentData();

    const refresh = setInterval(handleGetTorrentData, 5000);

    return () => {
      clearInterval(refresh);
    };
  }, []);

  useEffect(() => {
    if (!!autoPause) {
      handlePauseAllTorrents();
    }
  }, [autoPause, torrentData]);

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
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          padding: 8,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={async () => {
              await pauseAllTorrents();

              handleGetTorrentData();
            }}
          >
            <MaterialIcons name="pause" size={40} />
          </Pressable>
          <Pressable
            onPress={async () => {
              await resumeAllTorrents();

              handleGetTorrentData();
            }}
          >
            <MaterialIcons name="play-arrow" size={40} />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginRight: 8 }}>Auto Pause</Text>
          <Checkbox onValueChange={setAutoPause} value={autoPause} />
        </View>
      </View>
      <ScrollView
        overScrollMode="never"
        style={{ height: height - 57, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {torrentData.map((torrent) => {
          return (
            <View
              key={torrent.hashString}
              style={{
                backgroundColor: "white",
                elevation: 2,
                marginBottom: 8,
                padding: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {torrent.name}
              </Text>
              <Text>
                {Number(torrent.percentDone * 100).toLocaleString(undefined, {
                  style: "percentage",
                  maximumFractionDigits: 2,
                })}
                % @ {torrent.rateDownload}
              </Text>
              <Text>{stateLookup(torrent.status)}</Text>
              <ProgressBar percentDone={torrent.percentDone} />
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
                  title={
                    torrent.status === 0 || torrent.status === 3
                      ? "Resume"
                      : "Stop"
                  }
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
