export const debounce = (callback, delay = 1000) => {
  let timeoutId;
  () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  }
};

export const chunkArray = (bigArray, chunkSize) => {
  let outputArr = [];

  if (chunkSize !== 0) {
    for (let i = 0; i < bigArray.length; i += chunkSize) {
      outputArr.push(bigArray.splice(i, i + chunkSize));
    }
  }

  return outputArr;
};