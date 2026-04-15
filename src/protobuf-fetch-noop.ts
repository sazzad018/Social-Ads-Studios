
export default function fetchNoop(filename: string, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options;
  }
  const err = new Error("Fetch is disabled in protobufjs to avoid window.fetch conflict.");
  if (callback) {
    callback(err);
    return;
  }
  return Promise.reject(err);
}
