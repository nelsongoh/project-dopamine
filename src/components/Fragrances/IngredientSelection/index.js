import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import NoteScaffold from '@/components/Fragrances/NoteScaffold';
import useStyles from './ingredientSelectionStyles';
import clsx from 'clsx';

const IngredientSelection = ({ 
  ingredients, selectedFunctions, chosenIngredients, updateChosenIngredients,
}) => {
  const classes = useStyles();
  // These are the ingredients that the user can select from, based on the functions
  // they picked in the previous step
  const [selectableIngredients, setSelectableIngredients] = useState(ingredients);
  // These are the filters which the user can toggle, to highlight the ingredients
  // which correspond to a given use function (e.g. Uplifing, Balancing)
  // The selectedFilter should be an object of booleans, with the key being the filter
  // and the boolean indicating whether the filter has been selected (true for yes, false for no)
  const initSelectedFilters = () => {
    // Set up the selectedFilter state
    let tempSelectedFunc = {};
    selectedFunctions.map((eachFunc) => {
      tempSelectedFunc[eachFunc] = false;
    });
    return tempSelectedFunc;
  };
  const [selectedFilter, setSelectedFilter] = useState(initSelectedFilters());
  const chooseFilter = (funcName) => {
    // Toggle the value of the filter that was chosen
    // and set the value of all other filters to false
    let filterState = {...selectedFilter};
    Object.keys(filterState).map((filterName) => {
      filterName === funcName ? 
        filterState[filterName] = !filterState[filterName] : 
        filterState[filterName] = false;
    });
    setSelectedFilter(filterState);
  };
  const initSelectedIngredients = () => {
    // Set up the selectedIngredients state
    let tempSelectedIngredients = { top: {}, middle: {}, base: {} };
    ingredients.map((eachIngredient) => {
      // For each of the note categories this ingredient is in
      for (let i = 0; i < eachIngredient.notes.length; i += 1) {
        /**
         * The chosenIngredients data structure should look like:
         * {
         *    top: Set(...),
         *    middle: Set(...),
         *    base: Set(...),
         * }
         */

        // If the ingredient is something that the user has already chosen, mark it as true
        if (Object.hasOwnProperty.call(chosenIngredients, eachIngredient.notes[i])) {
          if (chosenIngredients[eachIngredient.notes[i]].has(eachIngredient.name)) {
            tempSelectedIngredients[eachIngredient.notes[i]][eachIngredient.name] = true;
          } else {
            tempSelectedIngredients[eachIngredient.notes[i]][eachIngredient.name] = false;
          }
        } else {
          tempSelectedIngredients[eachIngredient.notes[i]][eachIngredient.name] = false;
        }
      }
    });
    return tempSelectedIngredients;
  };
  // These are the ingredients which the user has actually selected
  const [selectedIngredients, setSelectedIngredients] = useState(initSelectedIngredients());
  const toggleSelectIngredient = (ingredientName, noteType) => {
    let isIngredientSelected = !selectedIngredients[noteType][ingredientName];
    let tempNewChosenIngredients = {...chosenIngredients};

    // If the list of chosen ingredients has this particular note type
    if (Object.hasOwnProperty.call(chosenIngredients, noteType)) {
      // If we are going to select this ingredient
      if (isIngredientSelected) {
        // Only if the ingredient isn't already in the list
        if (!chosenIngredients[noteType].has(ingredientName)) {
          // We add the ingredient to the list
          tempNewChosenIngredients[noteType].add(ingredientName);
        }
      } else {
        // Else this ingredient is going to be removed
        // Only if this ingredient is in the list
        if (chosenIngredients[noteType].has(ingredientName)) {
          // Then we remove it
          tempNewChosenIngredients[noteType].delete(ingredientName);
        }
      }
    } else {

    }

    // We update the list of chosen ingredients
    updateChosenIngredients(tempNewChosenIngredients);
    // Then we update the local list of selected ingredients (To update the checkboxes)
    setSelectedIngredients({
      ...selectedIngredients, [noteType]: {
        ...selectedIngredients[noteType], [ingredientName]: !selectedIngredients[noteType][ingredientName]
      }
    });
  };

  const isTextDeEmphasized = (ingredientFuncs) => {
    // Text is de-emphasized when one of the filters have been toggled to 'True',
    // and none of the functions for this ingredient is the one that is marked 'True' 
    if (Object.values(selectedFilter).includes(true)) {
      let selectedFunc = Object.keys(selectedFilter).find((key) => selectedFilter[key] === true);
      if (!ingredientFuncs.includes(selectedFunc.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    // If the user has selected at least one function
    if (selectedFunctions.length > 0) {
      const filteredIngredients = new Set();
      selectedFunctions.map((eachFunc) => {
        ingredients.filter((ingredient) => (
          ingredient.functions.includes(eachFunc.toLowerCase())
        )).forEach((ingredient) => {
          filteredIngredients.add(ingredient);
        });
      });

      setSelectableIngredients(Array.from(filteredIngredients));
    } else {
      // Else if they have selected nothing, then ALL ingredients are considered selectable
      setSelectableIngredients(ingredients);
      // There is NO selected filter for the user to toggle
    }
  }, [selectedFunctions])

  return (
    <Grid
      container
      direction="column"
      spacing={5}
    >
      <Grid
        container
        item
        direction="row"
        alignItems="center"
        xs={12}
      >
        <Grid item>
          <Typography>You have selected:</Typography>
        </Grid>
        <Grid item>
          {selectedFunctions.map((eachFunc) => (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={selectedFilter[eachFunc] === true ? "default" : "outlined"}
              label={eachFunc}
              onClick={() => { chooseFilter(eachFunc) }}
            />
          ))}
        </Grid>
      </Grid>
      <NoteScaffold
        topNoteContent={
          <FormGroup row>
            {
              selectableIngredients.filter((ingredient) => ingredient.notes.includes("top"))
                .map((topNoteIngredients) => (
                  <FormControlLabel
                    key={Math.random()}
                    control={
                      <Checkbox
                        checked={selectedIngredients.top[topNoteIngredients.name]}
                        onChange={() => { toggleSelectIngredient(topNoteIngredients.name, "top") }}
                        name={topNoteIngredients.name}
                        color="secondary"
                      />
                    }
                    label={topNoteIngredients.name}
                    className={
                      clsx({
                        [classes.unEmphasizedText]: isTextDeEmphasized(topNoteIngredients.functions) 
                      })
                    }
                  />
                ))
            }
          </FormGroup>
        }
        midNoteContent={
          <FormGroup row>
            {
              selectableIngredients.filter((ingredient) => ingredient.notes.includes("middle"))
                .map((middleNoteIngredients) => (
                  <FormControlLabel
                    key={Math.random()}
                    control={
                      <Checkbox
                        checked={selectedIngredients.middle[middleNoteIngredients.name]}
                        onChange={() => { toggleSelectIngredient(middleNoteIngredients.name, "middle") }}
                        name={middleNoteIngredients.name}
                        color="secondary"
                      />
                    }
                    label={middleNoteIngredients.name}
                    className={
                      clsx({
                        [classes.unEmphasizedText]: isTextDeEmphasized(middleNoteIngredients.functions) 
                      })
                    }
                  />
                ))
            }
          </FormGroup>
        }
        baseNoteContent={
          <FormGroup row>
            {
              selectableIngredients.filter((ingredient) => ingredient.notes.includes("base"))
                .map((baseNoteIngredients) => (
                  <FormControlLabel
                    key={Math.random()}
                    control={
                      <Checkbox
                        checked={selectedIngredients.base[baseNoteIngredients.name]}
                        onChange={() => { toggleSelectIngredient(baseNoteIngredients.name, "base") }}
                        name={baseNoteIngredients.name}
                        color="secondary"
                      />
                    }
                    label={baseNoteIngredients.name}
                    className={
                      clsx({
                        [classes.unEmphasizedText]: isTextDeEmphasized(baseNoteIngredients.functions) 
                      })
                    }
                  />
                ))
            }
          </FormGroup>
        }
      />
    </Grid>
  );
};

export default IngredientSelection;
