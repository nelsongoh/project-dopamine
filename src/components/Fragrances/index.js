import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import ContainerSize from './ContainerSize';
import DilutionLevel from './DilutionLevel';
import FragranceFunction from './FragranceFunction';
import IngredientSelection from './IngredientSelection';
import NoteProportion from './NoteProportion';
import DropletDistribution from './DropletDistribution';
import LoadingScreen from '@/components/Loading/loading';
import retrieveFragrancesContent from '@/client-lib/content/retrieveFragrancesContent';
import { FragranceData } from '@/models/fragrances';
import Content from '@/content';
import { 
  fragranceFunctionsToSelectables, selectedFragranceFunctionsToArray 
} from '@/utils/fragrances';
import useStyles from './fragrancesStyles';

const Fragrances = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [fragranceData, setFragranceData] = useState(FragranceData());
  const [containerSize, setContainerSize] = useState({ selected: null, value: null });
  const [dilutionLevel, setDilutionLevel] = useState(null);
  const [fragranceFunctions, setFragranceFunctions] = useState([]);
  /**
   * chosenIngredients follows a data structure of:
   * {
   *    top: Set(
   *      ingredient #1,
   *      ingredient #2,
   *      ...
   *    ),
   *    middle: Set(
   *      ...
   *    ),
   *    base: Set(
   *      ...
   *    ),
   * }
   */
  const [chosenIngredients, setChosenIngredients] = useState({ top: new Set(), middle: new Set(), base: new Set() });
  let noteProportions = new Map();
  noteProportions.set('top', 30);
  noteProportions.set('middle', 40);
  noteProportions.set('base', 30);
  const [noteRatios, setNoteRatios] = useState(noteProportions);
  const [noteDropletCapacity, setNoteDropletCapacity] = useState({ top: -1, middle: -1, base: -1 });
  const [dropletAssignment, setDropletAssignment] = useState({ top: {}, middle: {}, base: {} });
  const handleUpdateFragranceFunctions = (selectedFunctions) => {
    // Format the output
    let outputChosenIngredients = {...chosenIngredients};

    // Filter out ingredients that were already chosen by the user
    let tempChosenIngredients = fragranceData.ingredients.filter((ingr) => {
      for (let i = 0; i < Object.keys(chosenIngredients).length; i += 1) {
        if (chosenIngredients[Object.keys(chosenIngredients)[i]].has(ingr.name)) {
          return true;
        }
      }
      return false;
    });

    // If there are specific fragrance functions that have been selected
    if (!Object.values(selectedFunctions).every((func) => func === false)) {
      // We should take note to remove ingredients which were
      // previously chosen (if any), but no longer available due to
      // the de-selection of certain functions
      
      // Get the functions which were selected
      const selectedFuncs = Object.keys(selectedFunctions)
        .filter((eachFunc) => selectedFunctions[eachFunc] === true)
        .map((eachFunc) => eachFunc.toLowerCase());

      // Include ingredients that have the selected function(s)
      // and remove those that do not
      tempChosenIngredients = tempChosenIngredients
        .filter((ingr) => {
          let isIngrValid = false;

          for (let i = 0; i < ingr.functions.length; i += 1) {
            if (selectedFuncs.includes(ingr.functions[i])) {
              isIngrValid = true;
              break;
            }
          }

          Object.keys(outputChosenIngredients).forEach((noteType) => {
            if (outputChosenIngredients[noteType].has(ingr.name) && !isIngrValid) {
              outputChosenIngredients[noteType].delete(ingr.name);
            }
          });

          return isIngrValid;
        });
    }

    tempChosenIngredients.forEach((ingr) => {
      ingr.notes.forEach((noteType) => {
        // Check to make sure that the outputChosenIngredients has this given note type
        if (Object.hasOwnProperty.call(outputChosenIngredients, noteType)) {
          // We include the name of this ingredient to the output
          outputChosenIngredients[noteType].add(ingr.name);
        }
      })
    });

    setChosenIngredients(outputChosenIngredients);
    setFragranceFunctions(selectedFunctions);
  }

  // This gets triggered once when the component mounts
  useEffect(() => {
    const getFragrancesData = async () => {
      const resp = await retrieveFragrancesContent();
      console.log(resp.data);
      
      if (resp.success) {
        setFragranceData({
          containerSizes: resp.data.containerSizeInMl,
          dilutionLevels: resp.data.dilutionLevelPercent,
          functions: resp.data.functions,
          ingredients: resp.data.ingredients,
        });
        setContainerSize({
          selected: resp.data.containerSizeInMl[0],
          value: resp.data.containerSizeInMl[0]
        });
        setDilutionLevel(resp.data.dilutionLevelPercent[0]);
        setFragranceFunctions(
          fragranceFunctionsToSelectables(resp.data.functions)
        );
        setIsLoading(false);
      } else {
        console.log(resp.errors);
      }
    }

    getFragrancesData();
  }, []);

  const [shouldRecalcDistrib, setShouldRecalcDistrib] = useState(true);
  const turnOffRecalcDistrib = () => {
    setShouldRecalcDistrib(false);
  };
  /**
   * This useEffect hook listens for changes to any of the factors
   * which may affect the number of droplets, and triggers a flag
   * to indicate a need for the DropletDistribution sub-component
   * to perform a re-calculation
   */
  useEffect(() => {
    setShouldRecalcDistrib(true);
  }, [chosenIngredients, noteRatios, containerSize.value, dilutionLevel]);
  

  const getStepContent = (step) => {
    if (step >= 0 && step < Content('en').pages.fragrances.stepDesc.length) {
      return Content('en').pages.fragrances.stepDesc[step];
    } else {
      return Content('en').pages.fragrances.stepDescUnknown;
    }
  }

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => (
      isStepValid(prevActiveStep) ? prevActiveStep + 1 : prevActiveStep
    ));
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const isStepValid = (currStep) => {
    switch (currStep) {
      // For the Container Size step
      case 0: {
        // If the container size is a valid number, the step is valid
        if (Number.isInteger(containerSize.value) && containerSize.value > 0) {
          return true;
        }
        return false;
      }
      // For the Dilution Level step
      case 1: {
        // If the dilution level is a valid number, the step is valid
        if (Number.isInteger(dilutionLevel) && dilutionLevel > 0) {
          return true;
        }
        return false;
      }
      // For the Fragrance Function step
      case 2: {
        // No validation step required here
        return true;
      }
      // For the Ingredient Selection step
      case 3: {
        // If at least one ingredient has been selected, the step is valid
        let numIngredientsSelected = 0;
        Object.values(chosenIngredients).forEach((noteIngr) => numIngredientsSelected += noteIngr.size);
        if (numIngredientsSelected > 0) {
          return true;
        }
        return false;
      }
      // For the Note Proportion step
      case 4: {
        // If the sum of all proportions across note types equal to 100,
        // the step is valid
        let proportionSum = 0;
        for (let noteProportion of noteRatios.values()) {
          proportionSum += noteProportion;
        }
        if (proportionSum === 100) {
          return true;
        }
        return false;
      }
      // For the Droplet Distribution step
      case 5: {
        // If all the droplets distributed is equal to the max number of droplets
        // the step is valid
        const totalNoteDropletCapacity = Object.values(noteDropletCapacity).reduce((acc, noteMax) => acc + noteMax);
        let totalAssignedDroplets = 0;
        Object.values(dropletAssignment).forEach((ingrObj) => {
          Object.values(ingrObj).forEach((ingrDropletsAssigned) => {
            totalAssignedDroplets += ingrDropletsAssigned;
          });
        })
        if (totalAssignedDroplets === totalNoteDropletCapacity) {
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  };

  return (
    isLoading ? <LoadingScreen isOpen={true} /> : (
      <Stepper activeStep={activeStep} orientation="vertical">
        {Content('en').pages.fragrances.steps.map((label, index) => {
          let stepComponent = null;
          switch (index) {
            case 0: {
              stepComponent = <ContainerSize
                selectedContainerSize={containerSize}
                sizes={fragranceData.containerSizes}
                updateSelectedSize={setContainerSize}
              />;
              break;
            }
            case 1: {
              stepComponent = <DilutionLevel
                selectedDilutionLevel={dilutionLevel}
                levels={fragranceData.dilutionLevels}
                updateSelectedLevel={setDilutionLevel}
              />;
              break;
            }
            case 2: {
              stepComponent = <FragranceFunction
                functions={fragranceFunctions}
                updateSelectedFunction={handleUpdateFragranceFunctions}
                ingredients={fragranceData.ingredients}
              />;
              break;
            }
            case 3: {
              stepComponent = <IngredientSelection
                ingredients={fragranceData.ingredients}
                selectedFunctions={
                  selectedFragranceFunctionsToArray(fragranceFunctions)
                }
                chosenIngredients={chosenIngredients}
                updateChosenIngredients={setChosenIngredients}
              />;
              break;
            }
            case 4: {
              stepComponent = <NoteProportion
                noteRatios={noteRatios}
                updateRatios={setNoteRatios}
              />
              break;
            }
            case 5: {
              stepComponent = <DropletDistribution
                selectedIngredients={chosenIngredients}
                noteProportions={noteRatios}
                containerVolume={containerSize.value}
                dilution={dilutionLevel}
                maxDropletCount={noteDropletCapacity}
                updateMaxDropletCount={setNoteDropletCapacity}
                assignedDroplets={dropletAssignment}
                updateAssignedDroplets={setDropletAssignment}
                shouldRecalculate={shouldRecalcDistrib}
                toggleRecalculateOff={turnOffRecalcDistrib}
              />
              break;
            }
            default:
              break;
          }

          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography className={classes.stepContent}>{getStepContent(index)}</Typography>
                {stepComponent}
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      variant="outlined"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isStepValid(activeStep)}
                      onClick={() => { handleNext(activeStep) }}
                      className={classes.button}
                    >
                      {activeStep === Content('en').pages.fragrances.steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    )
  );
};

export default Fragrances;
