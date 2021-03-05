import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Content from '@/content';
import useStyles from './noteScaffoldStyles';

const NoteScaffold = ({ 
  topNoteContent, midNoteContent, baseNoteContent,
}) => {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-evenly"
      alignItems="flex-start"
    >
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>
          {Content('en').pages.fragrances.noteTypes.top}
        </Typography>
        {topNoteContent}
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>
          {Content('en').pages.fragrances.noteTypes.mid}
        </Typography>
        {midNoteContent}
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={12} md={3}>
        <Typography variant="h4" className={classes.title}>
          {Content('en').pages.fragrances.noteTypes.base}
        </Typography>
        {baseNoteContent}
      </Grid>
    </Grid>
  );
};

export default NoteScaffold;
