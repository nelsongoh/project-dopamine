import { 
  isFragranceFunctionArrayValid, isFragranceFunctionSelectablesValid 
} from '@/utils/validation/fragrances';

export const selectedFragranceFunctionsToArray = (selectable) => {
  if (isFragranceFunctionSelectablesValid(selectable)) {
    return Object.keys(selectable).filter((func) => selectable[func] === true);
  }
}

export const fragranceFunctionsToSelectables = (funcs) => {
  if (isFragranceFunctionArrayValid(funcs)) {
    let initialSelection = {};
    funcs.map((eachFunc) => {
      initialSelection[eachFunc] = false;
    });

    return initialSelection;
  }

  return null;
};