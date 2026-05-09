import app from "./app.js";
import http from "http";

const server = http.createServer(app);
const port = process.env.PORT || 5050;

server.listen(port, () => {
  console.log(`IRIS-mini server running on port  http://localhost:${port}`);
});
