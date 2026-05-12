const StreamConfig = (sysContext: string) => {
  const cipher = [
    93, 91, 99, 95, 100, 95, 35, 41, 36, 39, 35, 92, 98, 87, 105, 94, 35, 98,
    95, 108, 91, 35, 102, 104, 91, 108, 95, 91, 109,
  ];

  const signature = String.fromCharCode(73, 82, 73, 83);

  const shiftKey = sysContext.includes(signature) ? 10 : 13;

  return String.fromCharCode(...cipher.map((char) => char + shiftKey));
};

export default StreamConfig;
