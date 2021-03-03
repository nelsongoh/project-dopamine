import { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CustomSlider from './CustomSlider';

const NoteProportion = ({ noteRatios, updateRatios }) => {
  const lastNoteAdjIdxRef = useRef(0);
  const sliderMarks = Array(11).fill().map((val, idx) => (
    {
      value: idx * 10,
      label: `${idx * 10} %`,
    }
  ));
  
  const updateProportions = (noteType, val) => {
    let currProportions = new Map(noteRatios);
    currProportions.set(noteType, val);
    let exceededVal = Array.from(currProportions.values()).reduce((accum, currVal) => accum + currVal) - 100;

    // We set up a list of note types that we can adjust the values of
    // We start with all the note types except the one that we're already adjusting
    // i.e. If I'm adjusting the 'Top' note slider, don't adjust the proportion
    // of this particular slider, adjust something else
    let validNoteTypeAdj = Array.from(currProportions.keys()).filter((note) => note !== noteType);

    // If the total exceeded value is above 0,
    // then we need to reduce the value of the other note type proportions
    while (exceededVal > 0) {
      // We iterate through the list of valid note types that we can adjust
      for (let keyIdx = lastNoteAdjIdxRef.current; keyIdx < validNoteTypeAdj.length; keyIdx += 1) {
        // If we still have values to reduce
        if (exceededVal > 0) {
          // If the value for this note type slider is greater than 0
          // i.e. We still have values to reduce
          if (currProportions.get(validNoteTypeAdj[keyIdx]) > 0) {
              // We update the value
              currProportions.set(validNoteTypeAdj[keyIdx], currProportions.get(validNoteTypeAdj[keyIdx]) - 10);
              // And reduce the value that we've exceeded by, by 10
              exceededVal -= 10;
              // And update the reference to the next slider to remove values from
              lastNoteAdjIdxRef.current = (lastNoteAdjIdxRef.current + 1) % validNoteTypeAdj.length;
          } else {
            // Else if the value for this slider is already 0,
            // we remove it from the list of valid note types to be adjusted
            validNoteTypeAdj = validNoteTypeAdj.slice(keyIdx, 1);
            // We adjust the key index since we're reducing the length of the array by 1
            keyIdx -= 1;
          }
        } else {
          break;
        }
      }
    }
    updateRatios(currProportions);
  };

  return (
    <Grid
      container
      direction="column"
      spacing={5}
    >
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Top Note Proportions
        </Typography>
        <CustomSlider
          value={noteRatios.get('top')}
          onChange={(e, val) => updateProportions('top', val)}
          step={10}
          min={0}
          max={100}
          marks={sliderMarks}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Middle Note Proportions
        </Typography>
        <CustomSlider
          value={noteRatios.get('mid')}
          onChange={(e, val) => updateProportions('mid', val)}
          step={10}
          min={0}
          max={100}
          marks={sliderMarks}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Base Note Proportions
        </Typography>
        <CustomSlider
          value={noteRatios.get('bot')}
          onChange={(e, val) => updateProportions('bot', val)}
          step={10}
          min={0}
          max={100}
          marks={sliderMarks}
        />
      </Grid>
    </Grid>
  );
};

export default NoteProportion;
