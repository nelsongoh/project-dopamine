import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import CustomSlider from './CustomSlider';

const NoteProportion = () => {
  const sliderMarks = Array(11).fill().map((val, idx) => (
    {
      value: idx * 10,
      label: `${idx * 10} %`,
    }
  ));

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
          defaultValue={30}
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
          defaultValue={40}
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
          defaultValue={30}
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
