import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = null;

export const connectToSignalR = (onStatsUpdate) => {
  connection = new HubConnectionBuilder()
    .withUrl("https://localhost:5054/Hubs/AdvertisementHub", {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveAdUpdate", (data) => {
    console.log("Received ad stats update", data);
    onStatsUpdate(data);
  });

  connection.start().catch(console.error);
};