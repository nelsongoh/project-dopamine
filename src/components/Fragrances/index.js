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

  const getStepContent = (step) => {
    if (step >= 0 && step < Content('en').pages.fragrances.stepDesc.length) {
      return Content('en').pages.fragrances.stepDesc[step];
    } else {
      return Content('en').pages.fragrances.stepDescUnknown;
    }
  }

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

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
                      onClick={handleNext}
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
