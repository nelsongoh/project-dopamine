import { useEffect, useRef, useState } from 'react';
import NoteScaffold from '@/components/Fragrances/NoteScaffold';
import DropletCounter from './DropletCounter';

const DropletDistribution = ({
  selectedIngredients, noteProportions, containerVolume, dilution,
}) => {
  const maxNoteDropletCountRef = useRef({ top: -1, middle: -1, base: -1 });
  const [dropletCountState, setDropletCountState] = useState({ top: {}, middle: {}, base: {} });
  const updateDropletCount = (noteType, updateType, ingredient) => {
    let newDropletCount = dropletCountState[noteType][ingredient];
    if (Object.hasOwnProperty.call(maxNoteDropletCountRef.current, noteType)) {
      if (updateType === 'ADD') {
        // If we want to add another droplet, there must be some spare droplets
        // for us to add for this note type
        const currNoteDropletCountState = Object.values(dropletCountState[noteType]).reduce((accum, val) => accum + val);
        if (currNoteDropletCountState < maxNoteDropletCountRef.current[noteType]) {
          newDropletCount += 1;
        }
      } else if (updateType === 'REMOVE') {
        // If we want to remove a droplet, there must be droplets for us
        // to remove from this particular ingredient
        if (dropletCountState[noteType][ingredient] > 0) {
          newDropletCount -= 1;
        }
      }
      setDropletCountState({
        ...dropletCountState,
        [noteType]: {
          ...dropletCountState[noteType],
          [ingredient]: newDropletCount,
        }
      });
    }
  };

  const updateDropletCountNoteWrapper = (note) => {
    const noteType = note;
    return (updateType, ingredientName) => {
      updateDropletCount(noteType, updateType, ingredientName);
    };
  };

  const allocateMaxNoteDropletCount = () => {
    /**
     * Every 1 ml of container volume is 30 total essential oil drops
     */
    const REF_DROPS_PER_ML = 30;

    // These are the total number of droplets we need to distribute across all ingredients
    const totalDroplets = (dilution / 100) * containerVolume * REF_DROPS_PER_ML;
    // These are the droplet distributions across the note types
    // We establish that the minimum number of drops is 1,
    // provided that the proportion assigned is non-zero
    let noteDropletDistrib = {
      top: noteProportions.get('top') > 0 ? Math.max(Math.round((noteProportions.get('top') / 100) * totalDroplets), 1) : 0,
      middle: noteProportions.get('middle') > 0 ? Math.max(Math.round((noteProportions.get('middle') / 100) * totalDroplets), 1) : 0,
      base: noteProportions.get('base') > 0 ? Math.max(Math.round((noteProportions.get('base') / 100) * totalDroplets), 1) : 0,
    };

    maxNoteDropletCountRef.current = noteDropletDistrib;
  };

  // This function will utilise the business logic to determine the allocated droplet count
  const allocateDropletCount = () => {
    /**
     * The data structure for the droplet allocation will consist of keys
     * which correspond to the note type. The value of the key will be an
     * object containing ingredients as keys,
     * with the number of allocated droplets as its value.
     * 
     * For example:
     * 
     * {
     *    top: {
     *      ingredient_1: 0,
     *      ingredient_2: 4,
     *      ...
     *    },
     *    middle: {
     *      ...
     *    },
     *    base: {
     *      ...
     *    }
     * }
     */
    let dropletAllocation = { top: {}, middle: {}, base: {} };

    // We iterate through the selected ingredients's note types
    // and allocate the droplet counts to each ingredient
    Object.keys(selectedIngredients).forEach((noteType) => {
      if (Object.hasOwnProperty.call(dropletAllocation, noteType)) {
        const numIngredientsForNote = selectedIngredients[noteType].size;
        const numDropletsPerIngr = Number.parseInt(maxNoteDropletCountRef.current[noteType] / numIngredientsForNote);
        let remainingDroplets = maxNoteDropletCountRef.current[noteType] % numIngredientsForNote;
        
        for (let ingrName of selectedIngredients[noteType]) {
          // If there are remaining droplets left to add
          let shouldAddRemainder = remainingDroplets > 0 ? true : false;
          
          dropletAllocation[noteType][ingrName] = numDropletsPerIngr + (shouldAddRemainder ? 1 : 0);

          // If we added a remaining droplet, remove one from the remaining droplets
          if (shouldAddRemainder) {
            remainingDroplets -= 1;
          }
        }
      }
    });

    return dropletAllocation;
  };

  /**
   * We need an effect hook to set up the state of the droplet count
   * and update it when the selected ingredients change
  */
  useEffect(() => {
    allocateMaxNoteDropletCount();
    const outputState = allocateDropletCount();
    setDropletCountState(outputState);
  }, [selectedIngredients, noteProportions, containerVolume, dilution]);

  
  return (
    <NoteScaffold
      topNoteContent={
        Object.keys(dropletCountState.top).map((ingrName) => (
          <DropletCounter
            key={Math.random()}
            ingredientName={ingrName}
            dropletCount={dropletCountState.top[ingrName]}
            updateDropletCount={updateDropletCountNoteWrapper('top')}
          />
        ))
      }
      midNoteContent={
        Object.keys(dropletCountState.middle).map((ingrName) => (
          <DropletCounter
            key={Math.random()}
            ingredientName={ingrName}
            dropletCount={dropletCountState.middle[ingrName]}
            updateDropletCount={updateDropletCountNoteWrapper('middle')}
          />
        ))
      }
      baseNoteContent={
        Object.keys(dropletCountState.base).map((ingrName) => (
          <DropletCounter
            key={Math.random()}
            ingredientName={ingrName}
            dropletCount={dropletCountState.base[ingrName]}
            updateDropletCount={updateDropletCountNoteWrapper('base')}
          />
        ))
      }
    />
  )
};

export default DropletDistribution;
