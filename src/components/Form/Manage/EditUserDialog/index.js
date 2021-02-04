import { Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import useStyles from './editUserDialogStyles';

const EditUserDialog = ({ open, onClose, children }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Dialog open={open}>
        <DialogTitle className={classes.root} onClose={onClose}>
          This is a test
          { onClose ? (
            <IconButton className={classes.closeBtn} onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          {children}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default EditUserDialog;
