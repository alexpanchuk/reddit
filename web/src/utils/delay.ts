export const delay = async (ms: number) =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });
