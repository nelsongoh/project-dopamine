import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
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

  const [containerSize, setContainerSize] = useState(null);
  const [dilutionLevel, setDilutionLevel] = useState(null);
  const [fragranceFunctions, setFragranceFunctions] = useState([]);
  const [chosenIngredients, setChosenIngredients] = useState([]);
  const handleUpdateFragranceFunctions = (selectedFunctions) => {
    
    let tempChosenIngredients = fragranceData.ingredients.filter((ingr) => chosenIngredients.includes(ingr.name));

    // If there are specific fragrance functions that have been selected
    if (!Object.values(selectedFunctions).every((func) => func === false)) {
      // We should take note to remove ingredients which were
      // previously chosen (if any), but no longer available due to
      // the de-selection of certain functions
      
      const selectedFuncs = Object.keys(selectedFunctions)
        .filter((eachFunc) => selectedFunctions[eachFunc] === true)
        .map((eachFunc) => eachFunc.toLowerCase());

      tempChosenIngredients = tempChosenIngredients
        .filter((ingr) => {
          for (let i = 0; i < ingr.functions.length; i += 1) {
            if (selectedFuncs.includes(ingr.functions[i])) {
              return true;
            }
          }
          return false;
        })
        .map((ingr) => ingr.name);
    }

    setChosenIngredients(tempChosenIngredients);
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
        setContainerSize(resp.data.containerSizeInMl[0]);
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
    // <Grid container direction="column" alignContent="center">
    //   <Grid item xs={12}>
    //     <h1>Where the container size selections should be</h1>
    //     <ContainerSize
    //       sizes={fragranceData.containerSizes}
    //       updateSelectedSize={setContainerSize}
    //     />
    //   </Grid>
    //   <Grid item xs={12}>
    //     <h1>Dilution level</h1>
    //     <DilutionLevel
    //       levels={fragranceData.dilutionLevels}
    //       updateSelectedLevel={setDilutionLevel}
    //     />
    //   </Grid>
    //   <Grid item xs={12}>
    //     <h1>Select fragrance function</h1>
    //   </Grid>
    //   <Grid item xs={12}>
    //     <h1>Select ingredients for Top, Middle, and Base notes</h1>
    //   </Grid>
    //   <Grid item xs={12}>
    //     <h1>Adjust volume of Top, Middle, and Base notes (sums to 100%)</h1>
    //   </Grid>
    //   <Grid item xs={12}>
    //     <h1>Assign droplet count for Top, Middle, and Base notes</h1>
    //   </Grid>
    // </Grid>
  );
};

export default Fragrances;
