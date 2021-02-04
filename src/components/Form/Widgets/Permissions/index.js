import { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useStyles from './permissionsStyles';
import Content from '../../../../lang';
import useAvailablePermissions from '../../../../../lib/client/useAvailablePermissions';
import LoginContext from '../../../../contexts/login';
import LoadingScreen from '../../../Loading/loading';

const UserPermissions = ({ updatePermissions, clearPermissionsToggle }) => {
  const classes = useStyles();
  const { user } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userPerms, setUserPerms] = useState([]);
  
  const [selectedPerms, setSelectedPerms] = useState({});
  const initSelectedPerms = (permsObj) => {
    let initPerms = {};
    Object.keys(permsObj).map((permKey) => {
      if (permsObj[permKey] !== "PROFILE") {
        initPerms[permKey] = false;
      } else {
        initPerms[permKey] = true;
      }
    });

    setSelectedPerms(initPerms);
  };
  // Transforms the selected permissions into an array of selected permission values
  const transformSelectedPerms = () => (
    Object.keys(selectedPerms).filter((permType) => (
      selectedPerms[permType] === true
    ))
  );
  const toggleSelectedPerm = (event) => {
    setSelectedPerms({...selectedPerms, [event.target.name]: event.target.checked});
  };  

  useEffect(() => {
    const retrieveAvailPerms = async () => {
      const retrievedPerms = await useAvailablePermissions(user);
      setUserPerms(retrievedPerms);
      initSelectedPerms(retrievedPerms);
      setIsLoading(false);
    };

    retrieveAvailPerms();
  }, []);

  useEffect(() => {
    updatePermissions(transformSelectedPerms());
  }, [selectedPerms]);

  useEffect(() => {
    if (userPerms.length !== 0) {
      initSelectedPerms(userPerms);
    }
  }, [clearPermissionsToggle]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Paper variant="outlined" className={classes.perms}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h4">{Content('en').pages.admin.users.create.fields.permissions.title}</Typography>
        </Grid>
        <Grid item>
          <FormGroup row>
            {Object.keys(userPerms).map((permIdx) => (
              <FormControlLabel
                key={Math.random()}
                control={
                  <Checkbox
                    disabled={userPerms[permIdx] === "PROFILE" ? true : false} 
                    checked={userPerms[permIdx] === "PROFILE" ? true : selectedPerms[permIdx]}
                    onChange={toggleSelectedPerm}
                    name={permIdx}
                    color="primary"
                  />
                }
                label={userPerms[permIdx]}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserPermissions;
