import { Server } from "socket.io";

export default function handler(req:any, res:any) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        const io = new Server(res.socket.server);
        io.on("connect", (socket) => {
            console.log("Client connected");
            // Handle incoming messages from the frontend
            socket.on("messages", (message) => {
                // Broadcast the received message to all connected clients
                io.emit("messages", message);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
        res.socket.server.io = io;
    }
  res.end();
}
