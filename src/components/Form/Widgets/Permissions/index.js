import { Fragment, useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useStyles from './permissionsStyles';
import Content from '@/content';
import useAvailablePermissions from '@/client-lib/useAvailablePermissions';
import LoginContext from '@/contexts/login';
import LoadingScreen from '@/components/Loading/loading';
import { 
  validatePermsObj, validateExistingPerms,
  transformToInitialSelectedPerms, transformToUserPermissions,
} from '@/utils/permissions';

const UserPermissions = ({ 
  updatePermissions, clearPermissionsToggle, existingPerms,
}) => {
  const classes = useStyles();
  const { userToken } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userPerms, setUserPerms] = useState({});
  const [selectedPerms, setSelectedPerms] = useState({});

  const initSelectedPerms = (permsObj) => {
    const initPerms = transformToInitialSelectedPerms(permsObj);
    setSelectedPerms(initPerms);
  };

  const isPermClassCheckboxDisabled = (perm) => {
    if (Object.keys(selectedPerms).length > 0) {
      // The checkbox should be disabled if:
      // 1) Some other checkbox is currently marked, and
      const isSomeCheckboxMarked = Object.values(selectedPerms.classPerms).includes(true);
      if (isSomeCheckboxMarked) {
        // 2) This is not THE selected checkbox
        return !selectedPerms.classPerms[perm];
      }
    }
    return false;
  };

  const toggleClassPerm = (event) => {
    let adjSelectedPerms = selectedPerms;
    // Mark all class permissions to false
    Object.keys(adjSelectedPerms.classPerms).map((classPerm) => {
      adjSelectedPerms.classPerms[classPerm] = false;
    });
    // Set the current class permission to its current value
    adjSelectedPerms.classPerms[event.target.name] = event.target.checked;
    // Manage all the related page permissions for this class
    Object.keys(adjSelectedPerms.pagePerms).map((permCat) => {
      Object.keys(adjSelectedPerms.pagePerms[permCat]).map((permCatPagePerm) => {
        let shouldUpdateCheckbox = false;
        // If we are marking the checkbox for the page permissions 
        if (event.target.checked === true) {
          // If this is an 'Admin' class permission, we mark any and all page-based permissions
          // or if this is the page permission matching the class permission selected
          if (
            event.target.name.toLowerCase() === "admin" ||
            permCat.toLowerCase() === event.target.name.toLowerCase()
          ) {
            adjSelectedPerms.pagePerms[permCat][permCatPagePerm] = event.target.checked
          } else {
            // Else this page permission does not belong to this class permission,
            // we need to set it to unmarked
            adjSelectedPerms.pagePerms[permCat][permCatPagePerm] = !event.target.checked
          }
        } else {
          // Else we are unmarking the checkbox for the page permissions,
          // if it's not the 'Profile' page
          if (permCatPagePerm != 1) {
            adjSelectedPerms.pagePerms[permCat][permCatPagePerm] = event.target.checked
          }
        }
      });
    });
    setSelectedPerms({...selectedPerms, ...adjSelectedPerms});
  };

  const isPermPageCheckboxDisabled = (perm) => {
    // The checkbox should be disabled if:
    // 1) It's the 'Profile' checkbox, OR
    if (perm.title.toLowerCase() === "profile") {
      return true;
    }
    // 2) A class-based permission has been marked
    const isClassPermMarked = Object.values(selectedPerms.classPerms).includes(true);
    if (isClassPermMarked) {
      return true;
    }
    return false;
  };

  const togglePagePerm = (event) => {
    // If NO class-based permissions have been toggled
    if (Object.values(selectedPerms.classPerms).every((isSelected) => isSelected === false)) {
      let adjSelectedPagePerms = selectedPerms.pagePerms;
      const pagePermCat = Object.keys(adjSelectedPagePerms);
      for (let i = 0; i < pagePermCat.length; i += 1) {
        let pagePermCatPerms = Object.keys(adjSelectedPagePerms[pagePermCat[i]]);
        for (let j = 0; j < pagePermCatPerms.length; j += 1) {
          if (pagePermCatPerms[j] == event.target.name) {
            adjSelectedPagePerms[pagePermCat[i]][pagePermCatPerms[j]] = event.target.checked;
            setSelectedPerms({...selectedPerms, pagePerms: adjSelectedPagePerms});
            return;
          }
        }
      }
    }
  };

  const initExistingPerms = (permsObj, availPerms) => {
    let permsClass = permsObj.permissionClass;
    let permsPages = permsObj.pages;

    let initPerms = {
      classPerms: {},
      pagePerms: {},
    };

    // We mark the permission classes that exist in the list of available permissions
    availPerms.pages.permissionClasses.map((classPerm) => {
      // True if the current class permission matches our indicated permission
      if (classPerm === permsClass) {
        initPerms.classPerms[classPerm] = true;
      } else {
        // False if it doesn't
        initPerms.classPerms[classPerm] = false;
      }

      // We initialize the category of this permission class
      // in the page permissions
      initPerms.pagePerms[classPerm] = {};
    });

    // We iterate through all the page permissions
    availPerms.pages.typeCodes.map((pagePerm) => {
      // If this is the matching permission class,
      // or this is the special case ('admin' permission class)
      // or if this page permission exists in the user's page permissions
      if (
        pagePerm.permissionClass === permsClass || 
        permsClass === "admin" ||
        permsPages.includes(pagePerm.typeCode) ||
        pagePerm.permissionClass === "profile"
      ) {
        // We mark the page permission to true
        initPerms.pagePerms[pagePerm.permissionClass][pagePerm.typeCode] = true;
      } else {
        // Otherwise we mark it as false
        initPerms.pagePerms[pagePerm.permissionClass][pagePerm.typeCode] = false;
      }
    });

    setSelectedPerms(initPerms);
  };

  useEffect(() => {
    const retrieveAvailPerms = async () => {
      const retrievedPerms = await useAvailablePermissions(userToken);
      setUserPerms(retrievedPerms);
      if (validateExistingPerms(existingPerms)) {
        initExistingPerms(existingPerms, retrievedPerms);
      } else {
        initSelectedPerms(retrievedPerms);
      }
      setIsLoading(false);
    };

    retrieveAvailPerms();
  }, []);

  useEffect(() => {
    updatePermissions(transformToUserPermissions(selectedPerms));
  }, [selectedPerms]);

  useEffect(() => {
    if (Object.keys(userPerms).length !== 0) {
      initSelectedPerms(userPerms);
    }
  }, [clearPermissionsToggle]);

  return (
    <Fragment>
      {isLoading ? <LoadingScreen isOpen={true} /> : (
        <Paper variant="outlined" className={classes.perms}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h4">
                {Content('en').pages.admin.users.create.fields.permissions.title}
              </Typography>
            </Grid>
            <Grid item>
              {validatePermsObj(userPerms) ? (
                <Fragment>
                  <FormLabel>Class-based</FormLabel>
                  <FormGroup className={classes.permsSection} row>
                    {userPerms.pages.permissionClasses.map((perm) => (
                      <FormControlLabel 
                        key={Math.random()}
                        control={
                          <Checkbox
                            disabled={isPermClassCheckboxDisabled(perm)}
                            checked={selectedPerms.classPerms[perm]}
                            onChange={toggleClassPerm}
                            name={perm}
                            color="primary"
                          />
                        }
                        label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                      />
                    ))}
                  </FormGroup>
                  <FormLabel>Page-based</FormLabel>
                  <FormGroup className={classes.permsSection} row>
                    {userPerms.pages.typeCodes.map((perm) => (
                      <FormControlLabel 
                        key={Math.random()}
                        control={
                          <Checkbox 
                            disabled={isPermPageCheckboxDisabled(perm)}
                            checked={selectedPerms.pagePerms[perm.permissionClass][perm.typeCode]}
                            onChange={togglePagePerm}
                            name={String(perm.typeCode)}
                            color="primary"
                          />
                        }
                        label={perm.title}
                      />
                    ))}
                  </FormGroup>
                </Fragment>
              ): null}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Fragment>
  );
}

export default UserPermissions;
