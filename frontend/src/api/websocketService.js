import { Client } from "@stomp/stompjs";

const client = new Client({
  brokerURL: import.meta.env.VITE_API_URL
    ? "wss://" + import.meta.env.VITE_API_URL + "/ws"
    : "ws://localhost:8080/ws",
  reconnectDelay: 5000,

  onConnect: () => {
    console.log("Connected");

    client.subscribe("/topic/refresh", (message) => {
      console.log("Refresh received:", message.body);
    });
  },
});

client.activate();
