import net from "net";

const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

export const getAvailablePort = async (
  primary: number = 6753,
  fallback: number = 8769,
): Promise<number> => {
  const isPrimaryFree = await isPortAvailable(primary);
  return isPrimaryFree ? primary : fallback;
};
