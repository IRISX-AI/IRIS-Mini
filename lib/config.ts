import net from "net";

export const getAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
    server.on("error", () => {
      resolve(getAvailablePort(startPort + 1));
    });
  });
};
