import { useState } from 'react';
import Chip from '@material-ui/core/Chip';
import useStyles from './fragranceFunctionStyles';
import NoteScaffold from '@/components/Fragrances/NoteScaffold';

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
    <NoteScaffold
      topNoteContent={
        functionsForNote.top.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          )
        })
      }
      midNoteContent={
        functionsForNote.middle.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          )
        })
      }
      baseNoteContent={
        functionsForNote.base.map((eachFunction) => {
          return (
            <Chip
              key={Math.random()}
              color="secondary"
              className={classes.chip}
              variant={functions[eachFunction] === true ? "default" : "outlined"}
              label={eachFunction}
              onClick={() => { toggleSelectedFunction(eachFunction) }}
            />
          )
        })
      }
    />
  );
};

export default FragranceFunction;
