import { Fragment, useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import useStyles from './fragranceFunctionStyles';

const FragranceFunction = ({ functions, updateSelectedFunction }) => {
  const classes = useStyles();
  const toggleSelectedFunction = (funcName) => {
    const toggledFunction = {...functions, [funcName]: !functions[funcName]};
    updateSelectedFunction(toggledFunction);
  }

  return (
    <Fragment>
      {Object.keys(functions).sort().map((eachFunction) => {
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
    </Fragment>
  );
};

export default FragranceFunction;
