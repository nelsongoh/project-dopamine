import retrieveStorageAssetUrls from './retrieveStorageAssets';

export const retrieveIndexPageAssets = async () => {
  let indexPageAssets = {
    backgroundImg: null,
  };

  let retrievalOutcome = await retrieveStorageAssetUrls([
    "public/indexPage/francesco-ungaro-2325447.jpg",
  ]);

  if (retrievalOutcome.success) {
    indexPageAssets.backgroundImg = retrievalOutcome.data[0];
  } else {
    console.log(retrievalOutcome.errors);
  }

  return indexPageAssets;
};