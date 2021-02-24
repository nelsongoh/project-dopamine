import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import useStyles from './fragranceFunctionStyles';

const FragranceFunction = ({ functions, updateSelectedFunction, ingredients }) => {
  const classes = useStyles();
  const toggleSelectedFunction = (funcName) => {
    const toggledFunction = {...functions, [funcName]: !functions[funcName]};
    updateSelectedFunction(toggledFunction);
  }
  const mapFunctionsToNoteType = () => {
    let noteTypeFunctions = {
      top: new Set(),
      middle: new Set(),
      base: new Set(),
    };

    ingredients.forEach((ingr) => {
      ingr.notes.forEach((noteType) => {
        ingr.functions.forEach((eachFunc) => {
          noteTypeFunctions[noteType].add(eachFunc);
        });
      });
    });

    Object.keys(noteTypeFunctions).forEach((noteType) => {
      noteTypeFunctions[noteType] = Array.from(noteTypeFunctions[noteType]).sort();
    });

    return noteTypeFunctions;
  };
  const [functionsForNote, setFunctionsForNote] = useState(mapFunctionsToNoteType());

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-evenly"
      alignItems="flex-start"
    >
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>Top notes</Typography>
        {functionsForNote.top.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          );
        })}
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>Middle notes</Typography>
        {functionsForNote.middle.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          );
        })}
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>Base notes</Typography>
        {functionsForNote.base.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default FragranceFunction;
