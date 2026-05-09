import net from "net";

/**
 * Checks if a port is available on the local machine.
 */
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

/**
 * Returns the primary port if available, otherwise returns the fallback.
 */
export const getAvailablePort = async (
  primary: number = 6753,
  fallback: number = 8762,
): Promise<number> => {
  const isPrimaryFree = await isPortAvailable(primary);
  return isPrimaryFree ? primary : fallback;
};
