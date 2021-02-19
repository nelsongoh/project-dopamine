const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const retrieveStorageAssetUrls = async (
  storageFilePaths = [],
) => {
  let outcome = {
    success: false,
    data: null,
    errors: null,
  };

  try {
    const bucket = admin.storage().bucket();
    const outputAssetUrls = await Promise.all(
      storageFilePaths.map(async (filePath) => {
        const filesResp = await bucket.getFiles({
          prefix: filePath
        });
        const backgroundImgUrl = filesResp[0][0].publicUrl();
        return backgroundImgUrl;
      })
    );

    outcome.success = true;
    outcome.data = outputAssetUrls;
  } catch (error) {
    switch (error.code) {
      case 'storage/object-not-found': {
        outcome.errors = "The object at the provided storage reference does not exist.";
        break;
      }

      case 'storage/unauthorized': {
        outcome.errors = "Unauthorized access to the storage asset."
        break;
      }

      case 'storage/unknown': {
        outcome.errors = "Something has gone wrong with retrieving the storage asset.";
        break;
      }

      case 'storage/bucket-not-found': {
        outcome.errors = "No bucket was configured for the cloud storage.";
        break;
      }

      case 'storage/project-not-found': {
        outcome.errors = "No project was configured for the cloud storage.";
        break;
      }

      case 'storage/quota-exceeded': {
        outcome.errors = "Quota on the cloud storage has been exceeded.";
        break;
      }

      case 'storage/unauthenticated': {
        outcome.errors = "Access to the asset storage requires authentication.";
        break;
      }

      case 'storage/retry-limit-exceeded': {
        outcome.errors = "Time limit exceeded while trying to perform the storage operation.";
        break;
      }

      case 'storage/canceled': {
        outcome.errors = "The storage operation has been canceled by the user.";
        break;
      }

      case 'storage/no-default-bucket': {
        outcome.errors = "No storage bucket has been configured.";
        break;
      }

      default:
        outcome.errors = error;
        break;
    }
  } finally {
    return outcome;
  }
}

export default retrieveStorageAssetUrls;
