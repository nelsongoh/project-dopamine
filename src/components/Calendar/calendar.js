import React, { Fragment, useEffect, useState } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import useStyles from './calendarStyles';

const generateMthViewDates = (dateRef) => {
  const firstOfMth = new Date(dateRef.getFullYear(), dateRef.getMonth(), 1);
  const lastOfMth = new Date(dateRef.getFullYear(), dateRef.getMonth() + 1, 0);
  let mthDateMap = {};
  mthDateMap[firstOfMth] = [];
  for (let i = -1; (firstOfMth.getDay() + i) >= 0; i -= 1) {
    mthDateMap[new Date(dateRef.getFullYear(), dateRef.getMonth(), i + 1)] = [];
  }
  for (let i = 2; i <= lastOfMth.getDate(); i += 1) {
    mthDateMap[new Date(dateRef.getFullYear(), dateRef.getMonth(), i)] = [];
  }
  for (let i = 1; (lastOfMth.getDay() + i) <= 6; i += 1) {
    mthDateMap[new Date(lastOfMth.getFullYear(), lastOfMth.getMonth() + 1, i)] = [];
  }
  return mthDateMap;
};

const generateMthViewEvents = (eventInfo, mthViewDates) => {
  const { dates, colorRef, idxZeroRefDate } = eventInfo.overlays.fortuneTelling;
  const refDate = new Date(idxZeroRefDate);

  Object.keys(mthViewDates).forEach((date) => {
    let dateColorIdx = Math.floor((new Date(date) - refDate) / (60 * 60 * 24 * 1000)) % 60;

    if (dateColorIdx < 0) {
      dateColorIdx = 60 + dateColorIdx;
    }

    mthViewDates[date].push({
      morn: colorRef[dates[dateColorIdx].morn],
      aftn: colorRef[dates[dateColorIdx].aftn],
    });
  });

  return mthViewDates;
};

const Calendar = ({ currDate, setNextMth, setPrevMth, content }) => {
  const classes = useStyles();

  const todayDate = new Date();

  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [mthDates, setMthDates] = useState(generateMthViewDates(currDate));

  useEffect(() => {
    if (content !== null && typeof(content) !== 'undefined') {
      const newMthDates = generateMthViewDates(currDate);
      setMthDates(generateMthViewEvents(content, newMthDates));
    } else {
      setMthDates(generateMthViewDates(currDate));
    }
  }, [currDate]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.calendarToolbar}>
        <Grid item xs={3} className={classes.centerGridItem}>
          <IconButton onClick={setPrevMth}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Grid>
        <Grid item xs={6} className={classes.centerGridItem}>
          <Typography variant="h4">
            {currDate.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.centerGridItem}>
          <IconButton onClick={setNextMth}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </Grid>
      </Grid>
      <GridList cellHeight={180} className={classes.gridList} cols={7}>
        {daysOfTheWeek.map((day) => (
          <GridListTile key={day} cols={1} style={{ height: 'auto' }}>
            <Typography className={classes.days}>{day}</Typography>
          </GridListTile>
        ))}
        {Object.keys(mthDates).sort((a,b) => Date.parse(a) - Date.parse(b)).map((date, idx) => {
          const calDate = new Date(date);
          let dateDisplay;

          // If this is today's date
          if (todayDate.setHours(0,0,0,0) === calDate.setHours(0,0,0,0)) {
            dateDisplay = (
              <Box className={classes.todayDate}>
                <Typography>{calDate.getDate()}</Typography>
              </Box>
            );
          } else if (calDate.getMonth() !== currDate.getMonth()) {  // Else if this date is not of this month's view
            dateDisplay = (
              <Typography className={classes.calDateOutsideMth}>{calDate.getDate()}</Typography>
            )
          } else {  // Else this date is for the month's view
            dateDisplay = (
              <Typography className={classes.calDateForMth}>{calDate.getDate()}</Typography>
            )
          }

          return (
            <GridListTile key={idx} col={1} className={classes.gridTile} style={{ height: '120px' }}>
              <Card className={classes.gridTileCard} variant="outlined" square>
                <CardContent>
                  {dateDisplay}
                  {mthDates[date].map((dayEvent, idx) => {
                    const mornStyle = classes[dayEvent.morn];
                    const aftnStyle = classes[dayEvent.aftn];

                    return (
                      <Fragment key={idx}>
                        <Chip label="AM" className={mornStyle} />
                        <Chip label="PM" className={aftnStyle} /> 
                      </Fragment>
                    )
                  })}
                </CardContent>
              </Card>
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

export default Calendar;
