import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },

  gridList: {
    minWidth: 200,
    maxWidth: 800,
    minHeight: 50,
  },

  centerGridItem: {
    textAlign: 'center',
  },

  calendarToolbar: {
    paddingBottom: '1em',
    minWidth: 200,
    maxWidth: 800,
  },

  days: {
    fontSize: 16,
    fontWeight: 'bolder',
    textAlign: 'center',
    paddingBottom: '1em',
  },

  todayDate: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
    display: 'flex',
    float: 'right',
    position: 'relative',
    marginLeft: '100%',
  },

  gridTile: {
    height: '120px',
  },

  gridTileCard: {
    height: '115px',
  },

  calDateForMth: {
    textAlign: 'right',
  },

  calDateOutsideMth: {
    textAlign: 'right',
    color: '#A9A9A9'
  },

  red: {
    backgroundColor: "red",
    color: "white",
  },

  green: {
    backgroundColor: "green",
    color: "white",
  },

  blue: {
    backgroundColor: "blue",
    color: "white",
  },

}));

export default useStyles;
