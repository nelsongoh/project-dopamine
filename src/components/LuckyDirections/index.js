import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Content from '@/content';
import useStyles from './luckDirectionsStyles';

const LuckyDirections = ({ content, currDate }) => {
  const btnLabels = Content('en').pages.calendar.luckyDirections.directionBtns;

  const classes = useStyles();
  const [isBtnDisabled, setIsBtnDisabled] = useState({
    N: content[currDate.getMonth()]['N'] === false ? true : false,
    NE: content[currDate.getMonth()]['NE'] === false ? true : false,
    NW: content[currDate.getMonth()]['NW'] === false ? true : false,
    S: content[currDate.getMonth()]['S'] === false ? true : false,
    SE: content[currDate.getMonth()]['SE'] === false ? true : false,
    SW: content[currDate.getMonth()]['SW'] === false ? true : false,
    E: content[currDate.getMonth()]['E'] === false ? true : false,
    W: content[currDate.getMonth()]['W'] === false ? true : false,
    Central: content[currDate.getMonth()]['Central'] === false ? true : false,
  });

  const [isBtnHighlighted, setIsBtnHighlighted] = useState({
    N: false,
    NE: false,
    NW: false,
    S: false,
    SE: false,
    SW: false,
    E: false,
    W: false,
    Central: false,
  });

  const toggleBtnHighlight = (direction) => {
    setIsBtnHighlighted({...isBtnHighlighted, [direction]: !isBtnHighlighted[direction]});
  }

  useEffect(() => {
    setIsBtnDisabled({
      N: content[currDate.getMonth()]['N'] === false ? true : false,
      NE: content[currDate.getMonth()]['NE'] === false ? true : false,
      NW: content[currDate.getMonth()]['NW'] === false ? true : false,
      S: content[currDate.getMonth()]['S'] === false ? true : false,
      SE: content[currDate.getMonth()]['SE'] === false ? true : false,
      SW: content[currDate.getMonth()]['SW'] === false ? true : false,
      E: content[currDate.getMonth()]['E'] === false ? true : false,
      W: content[currDate.getMonth()]['W'] === false ? true : false,
      Central: content[currDate.getMonth()]['Central'] === false ? true : false,
    });
  }, [currDate]);

  return (
    <Grid container spacing={3} direction="column">
      <Grid container item justify="center" alignItems="center">
        <Typography variant="h3" className={classes.titles}>{Content('en').pages.calendar.luckyDirections.title}</Typography>
      </Grid>
      <Grid container item justify="center" className={classes.directions}>
        {Object.keys(btnLabels).map((label, idx) => (
          <Button
            key={idx}
            variant={isBtnHighlighted[label] ? "contained" : "outlined"}
            disabled={isBtnDisabled[label]}
            color="primary"
            onClick={() => { toggleBtnHighlight(label); }}
          >
            {label}
          </Button>
        ))}
      </Grid>
      <Grid container item justify="center" className={classes.locations}>
        {Object.keys(isBtnDisabled).map((direction) => {
          if (!isBtnDisabled[direction]) {
            return (
              content.locations[direction].map((locName, idx) => (
                <Chip 
                  key={idx}
                  color="primary"
                  variant={isBtnHighlighted[direction] ? "default" : "outlined"}
                  label={typeof(content[currDate.getMonth()][direction]) == 'string' ? `(4D / ToTo) ${locName}` : locName}
                />
              ))
            );
          }
        })}
      </Grid>
    </Grid>
  )
};

export default LuckyDirections;
