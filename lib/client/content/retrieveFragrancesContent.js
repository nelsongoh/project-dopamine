import firebase from 'firebase/app';
import { initFirebase } from '../../../src/firebase';

const retrieveFragrancesContent = async () => {
  initFirebase();

  let outcome = {
    success: false,
    data: null,
    errors: null,
  };

  try {
    const db = firebase.firestore();

    const fragrancesDocRef = db.collection("definitions").doc("fragrances");
    const fragrancesData = await fragrancesDocRef.get();

    if (fragrancesData.exists) {
      outcome.data = fragrancesData.data();
      outcome.success = true;
    } else {
      throw "Could not locate the data for the fragrances toolkit."
    }

    const fragrancesIngredientsRef = db.collection("definitions").doc("fragrances").collection("ingredients");
    const fragrancesIngredientsSnapshot = await fragrancesIngredientsRef.get();

    outcome.data.ingredients = [];

    fragrancesIngredientsSnapshot.forEach((docSnapshot) => {
      outcome.data.ingredients.push(docSnapshot.data());
    });

  } catch (error) {
    outcome.success = false;
    outcome.errors = error;
  } finally {
    return outcome;
  }
};

export default retrieveFragrancesContent;
