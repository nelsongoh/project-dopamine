export const isFragranceFunctionSelectablesValid = (selectables) => {
  if (typeof(selectables) === "object") {
    return Object.values(selectables).every((selectableVal) => typeof(selectableVal) === "boolean");
  }
}

export const isFragranceFunctionArrayValid = (funcs) => {
  if (Array.isArray(funcs)) {
    return funcs.every((funcElement) => typeof(funcElement) === "string")
  }

  return false;
};

export const isDilutionValid = (dilutionNum) => {
  if (typeof(dilutionNum) === "number") {
    if (Number.isInteger(dilutionNum) && !Number.isNaN(dilutionNum)) {
      if (dilutionNum > 0 && dilutionNum <= 100) {
        return true;
      }
    }
  }

  return false;
};

export const isVolumeValid = (volNum) => {
  if (typeof(volNum) === "number") {
    if (Number.isInteger(volNum) && !Number.isNaN(volNum)) {
      if (volNum > 0) {
        return true;
      }
    }
  }

  return false;
};
