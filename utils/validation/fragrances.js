export const isVolumeValid = (volNum) => {
  if (typeof(volNum) === "number") {
    if (Number.isInteger(volNum) && !Number.isNaN(volNum)) {
      if (volNum > 0) {
        return true;
      }
    }
  }

  return false;
}