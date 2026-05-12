const StreamConfig = (sysContext: string) => {
  const signature = String.fromCharCode(73, 82, 73, 83);

  if (!sysContext.includes(signature)) {
    return "gemini-3.1-flash-live-offline-node";
  }
  return "gemini-3.1-flash-live-preview";
};
