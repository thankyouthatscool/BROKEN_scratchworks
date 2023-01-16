import AsyncStorage from "@react-native-async-storage/async-storage";

import { TorrentData } from "@types";

export const getLSTorrentData = async () => {
  try {
    const torrentLSDataString = await AsyncStorage.getItem("torrentData");

    if (!!torrentLSDataString) {
      const torrentLSData: TorrentData[] = JSON.parse(torrentLSDataString);

      return torrentLSData;
    }

    throw new Error();
  } catch {
    return [];
  }
};

export const setLSTorrentData = async (torrentData: TorrentData[]) => {
  try {
    await AsyncStorage.setItem("torrentData", JSON.stringify(torrentData));
    return "OK";
  } catch {
    return "DATA NOT SET";
  }
};
