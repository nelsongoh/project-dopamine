import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Content from '@/content';
import useStyles from './luckyColorsStyles';

const LuckyColors = ({ currDate, content }) => {
  const classes = useStyles();
  const currMthColors = content[currDate.getMonth()];
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={3}>
      <Grid container item justify="center">
        <Typography variant="h3">{Content('en').pages.calendar.luckyColors.title}</Typography>
      </Grid>
      <Grid container item justify="space-evenly">
        <GridList cellHeight={180} className={classes.gridList} cols={isMobileView ? 2 : 4}>
          {Object.keys(currMthColors).map((color) => {
            if (currMthColors[color] !== false) {
              return (
                <GridListTile key={Math.random()}>
                  <Paper variant="outlined" className={classes[color]} />
                  <GridListTileBar
                    title={typeof(currMthColors[color]) == 'string' ? `(${currMthColors[color]}) ${color}` : color}
                  />
                </GridListTile>
              );
            }
          })}
        </GridList>
      </Grid>
    </Grid>
  )
};

export default LuckyColors;
