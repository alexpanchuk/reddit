export const delay = async (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });
