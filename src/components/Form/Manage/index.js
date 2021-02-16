import { 
  Fragment, useContext, useEffect,
  useRef, useState 
} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { DataGrid } from '@material-ui/data-grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import useStyles from './manageUsersStyles';
import LoginContext from '../../../contexts/login';
import { useGetUsers, useUpdateUser } from '../../../../lib/client/useUsers';
import LoadingScreen from '../../Loading/loading';
import Content from '../../../lang';
import UserForm from '../../Form/User';
import { User, UserErrors } from '../../../models/register';
import EditUserDialog from './EditUserDialog';
import { validateAdminEditUser } from '../../../../utils/validation/form';
import { chunkArray, debounce } from '../../../../utils/common';
import { userPermissionSetToArray } from '../../../../utils/permissions';

const ManageUsers = () => {
  const classes = useStyles();
  const { userToken } = useContext(LoginContext);
  // The reference to the listener for the user data
  const userDataListener = useRef(null);
  // The reference to the listener for the user metadata
  // we need this to keep reference to the total number of user pages
  const userMetadataListener = useRef(null);
  const [userMetadata, setUserMetadata] = useState({});
  // The reference to the user data from the Auth instance
  const authUserRef = useRef([]);
  // The reference to the user details data from the database
  // Follows the structure of:
  /* 
    {
      <doc_id>: {
        data: <doc_data>,
        page: <page_num_of_table>
      }
    }
  */
  const userDetailsRef = useRef({});
  // The reference to the index mapping the page number to the document IDs in that page
  // Follows the structure of:
  /*
    [
      [
        <doc_id_1>,
        <doc_id_2>,
        ...
      ]
    ]
  */
  // Starts with an empty array in an array of documents
  const pageToDocIdRef = useRef([[]]);
  // The reference to the current page that we're on
  const currPageRef = useRef(0);
  // State to determine if the data is ready for display in the table
  const [isDisplayReady, setIsDisplayReady] = useState(false);
  const refreshDisplay = async (pageForRefresh) => {
    // If this is the current page we're looking at
    if (currPageRef.current === pageForRefresh) {
      // We set the table to a 'Loading' state
      setIsDisplayReady(false);
      // Fetch a fresh set of auth user data
      await fetchUserData(nextPageTokenRef.current[pageForRefresh]); 
      // and update the rows
      updateRowsView();
    }
  };

  const [rows, setRows] = useState([]);
  
  const nextPageTokenRef = useRef([undefined]);

  const NUM_USERS_ON_PAGE = 100;

  // The wrapper function to retrieve the user's auth data
  const fetchUserData = async (npt) => {
    const getUsersOutcome = await useGetUsers(userToken, npt, NUM_USERS_ON_PAGE);
    if (!getUsersOutcome.success) {
      console.log("Something has gone wrong with retrieving the user information for the 'Manage Users' tab in the admin panel.");
      console.log("Something's gone wrong with the user data retrieval.");
      console.log(getUsersOutcome.errorMsg);
    } else if (getUsersOutcome.data) {
      authUserRef.current = getUsersOutcome.data.users;
      // If there is a next page token, we add it
      if (getUsersOutcome.data.nextPageToken !== null) {
        nextPageTokenRef.current[currPageRef.current + 1] = getUsersOutcome.data.nextPageToken;
      }
    }
  };

  const removeListeners = () => {
    // Remove the user metadata listener
    if (userMetadataListener.current !== null && typeof(userMetadataListener.current) !== "undefined") {
      if (Object.hasOwnProperty.call(userMetadataListener.current, "unsubscribe")) {
        userMetadataListener.current.unsubscribe();
      }
    }

    // Remove the user data listener
    if (userDataListener.current !== null && typeof(userDataListener.current) !== "undefined") {
      if (Object.hasOwnProperty.call(userDataListener.current, "unsubscribe")) {
        userDataListener.current.unsubscribe();
      }
    }
  };

  const transformRowsForGrid = () => {
    // We'll need to know which page the user is on
    // and the number of users we are displaying on each page
    return authUserRef.current.map((authUser, idx) => (
      {
        id: idx,
        email: authUser.email,
        firstName: userDetailsRef.current[authUser.uid].data.personal.firstName,
        lastName: userDetailsRef.current[authUser.uid].data.personal.lastName,
        isEnabled: authUser.isAccEnabled,
        permissions: userDetailsRef.current[authUser.uid].data.permissions,
        editUser: idx,
      }
    ));
  };

  const updateRowsView = () => {
    setRows(transformRowsForGrid());
    // After setting the rows, we set the display flag to true
    setIsDisplayReady(true);
  };

  const initUserMetadataListener = async () => {
    const unsub = firebase.firestore().collection("metadata").doc("users")
      .onSnapshot((doc) => {
        setUserMetadata(doc.data());
      });

    userMetadataListener.current = {
      unsubscribe: unsub,
    };
  };

  const initUserDataListener = async () => {
    const unsub = firebase.firestore().collection("users")
      .onSnapshot((snapshot) => {
        let earliestFreePage = pageToDocIdRef.current.length - 1;
        let refresh = {
          required: false,
          pageForRefresh: -1,
        };
        snapshot.docChanges().forEach((change) => {
          // If this is a new document that was added
          if (change.type === "added") {
            // If there is space in this page to place our data
            if (pageToDocIdRef.current[earliestFreePage].length < NUM_USERS_ON_PAGE) {
              // We add it in
              pageToDocIdRef.current[earliestFreePage].push(change.doc.id);
            } else {
              // We need to create a new page for this data
              pageToDocIdRef.current.push([change.doc.id]);
              earliestFreePage = pageToDocIdRef.current.length - 1;
            }
            // We create the user details entry in the index
            userDetailsRef.current[change.doc.id] = {
              data: change.doc.data(),
              page: earliestFreePage,
            };
            // If this data is on the page that the user is currently browsing
            // we indicate a refresh is required
            if (earliestFreePage === currPageRef.current) {
              refresh.required = true;
              refresh.pageForRefresh = earliestFreePage;
            }
          }
          // Else if this is a modified document
          else if (change.type === "modified") {
            // We modify the document's details
            userDetailsRef.current[change.doc.id].data = change.doc.data();
            if (userDetailsRef.current[change.doc.id].page === currPageRef.current) {
              refresh.required = true;
              refresh.pageForRefresh = userDetailsRef.current[change.doc.id].page;
            }
          }
          // Else if this is a deleted document
          else if (change.type === "removed") {
            // We remove the document's details
            let pageToRemoveFrom = userDetailsRef.current[change.doc.id].page;
            // We remove the document ID from the page to document index
            let removedElementIdx = pageToDocIdRef.current[pageToRemoveFrom].indexOf(change.doc.id);
            if (removedElementIdx !== -1) {
              pageToDocIdRef.current[pageToRemoveFrom].splice(removedElementIdx, 1);
              // We need to reorganize the pageToDocIdRef elements,
              // by joining everything into a single array,
              // and then splitting them back into smaller arrays of length NUM_USERS_ON_PAGE
              pageToDocIdRef.current = chunkArray(pageToDocIdRef.current, NUM_USERS_ON_PAGE);
              // Once done, we update the earliestFreePage
              earliestFreePage = pageToDocIdRef.current.length - 1;
              if (earliestFreePage === currPageRef.current) {
                refresh.required = true;
                refresh.pageForRefresh = earliestFreePage;
              }
            }
          }
        });
        // If a refresh is required, trigger one
        if (refresh.required) {
          refreshDisplay(refresh.pageForRefresh);
        }
      });
    userDataListener.current = {
      unsubscribe: unsub,
    };
  };

  useEffect(() => {
    // We initialize the metadata listener when the component first mounts
    initUserMetadataListener();
    // We initialize the user data listener when the component first mounts
    initUserDataListener();
    return () => {
      // When we unmount this component, we remove all listeners
      removeListeners();
    }
  }, []);
  
  const handlePageChange = async (nextPageNum) => {
    // Perform a sanity check on the page numbers, i.e. The page we're going to is valid
    if (nextPageNum > 0 && nextPageNum <= (userMetadata.totalUserCount || 0)) {
      // When we initiate a page change, we set the table's display status to 'Loading'
      setIsDisplayReady(false);

      // We update the page we're going to
      currPageRef.current = nextPageNum - 1;

      refreshDisplay(currPageRef.current);
    }
  };

  const [selectedUserDetails, setSelectedUserDetails] = useState(User());
  const handleUpdateFirstName = (event) => {
    setSelectedUserDetails({...selectedUserDetails, firstName: event.target.value});
  };
  const handleUpdateLastName = (event) => {
    setSelectedUserDetails({...selectedUserDetails, lastName: event.target.value});
  };
  const updatePermissions = (permsObj) => {
    setSelectedUserDetails({...selectedUserDetails, permissions: permsObj});
  };
  const toggleAccountStatus = () => {
    setSelectedUserDetails({...selectedUserDetails, isEnabled: !selectedUserDetails.isEnabled});
  }
  const [selectedUserErrors, setSelectedUserErrors] = useState(UserErrors());

  const selectedUserRowIdxRef = useRef(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = (idx) => {
    setIsDialogOpen(true);
    setSelectedUserDetails({
      ...selectedUserDetails,
      firstName: rows[idx].firstName,
      lastName: rows[idx].lastName,
      email: rows[idx].email,
      isEnabled: rows[idx].isEnabled,
      permissions: rows[idx].permissions,
    });
    selectedUserRowIdxRef.current = idx;
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const cols = [
    { field: "email", headerName: Content('en').pages.admin.users.manage.cols.headers.email, flex: 0.4 },
    { field: "firstName", headerName: Content('en').pages.admin.users.manage.cols.headers.firstName, flex: 0.2 },
    { field: "lastName", headerName: Content('en').pages.admin.users.manage.cols.headers.lastName, flex: 0.2 },
    {
      field: "isEnabled", 
      headerName: Content('en').pages.admin.users.manage.cols.headers.accStatus.title,
      renderCell: (params) => {
        return (
          <Chip
            variant="outlined"
            label={
              params.value ? 
              Content('en').pages.admin.users.manage.cols.headers.accStatus.types.enabled :
              Content('en').pages.admin.users.manage.cols.headers.accStatus.types.disabled
            }
            className={params.value ? classes.accEnabled : classes.accDisabled}
          />
        ); 
      },
      flex: 0.2,
    },
    {
      field: "editUser",
      headerName: Content('en').pages.admin.users.manage.cols.headers.edit.title,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon>edit</Icon>}
            onClick={() => { openDialog(params.value) }}
          >
            {Content('en').pages.admin.users.manage.cols.headers.edit.btn}
          </Button>
        );
      },
      flex: 0.2,
    },
  ];

  const [isBtnsDisabled, setIsBtnsDisabled] = useState(false);

  const checkEditUserDetailsValid = () => {
    if (rows.length > 0) {
      if (selectedUserRowIdxRef.current !== null) {
        return validateAdminEditUser(
          selectedUserDetails,
          User(
            rows[selectedUserRowIdxRef.current].firstName,
            rows[selectedUserRowIdxRef.current].lastName,
            rows[selectedUserRowIdxRef.current].email,
            rows[selectedUserRowIdxRef.current].isEnabled,
            rows[selectedUserRowIdxRef.current].permissions,
          )
        );
      }
    }

    return false;
  };

  const submitForm = async () => {
    // Disable the cancel and submit button
    setIsBtnsDisabled(true);
    // Validate the edited user details
    // If the user details are valid, proceed to submit the form for editing
    if (checkEditUserDetailsValid()) {
      let transformedUserDetails = userPermissionSetToArray(selectedUserDetails);
      transformedUserDetails.uid = authUserRef.current[selectedUserRowIdxRef.current].uid;
      let editUserOutcome = await useUpdateUser(userToken, transformedUserDetails);

      // If the form has been successfully submitted
      if (editUserOutcome.success) {
        // Close the form
        closeDialog();
        // Display a success chip to the user
        openSnackbar(true);
      } else {
        // Else, display an error to the user (In the form)
        setSelectedUserErrors(editUserOutcome.errors);
      }
    } else {
      // Else, update the error message to the user (In the Snackbar)
      openSnackbar(false);
    }
    // Enable the cancel and submit button 
    setIsBtnsDisabled(false);
  };

  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: "success",
  });
  const openSnackbar = (isSuccess) => {
    setSnackbarStatus({ 
      isOpen: true, type: isSuccess ? "success" : "error"
    });
  };
  const closeSnackbar = () => {
    setSnackbarStatus({...snackbarStatus, isOpen: false});
  };

  return (
    <Fragment>
      <Snackbar open={snackbarStatus.isOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus.type}>
          {
            snackbarStatus.type === "success" ? (
              Content('en').pages.admin.users.manage.editUserDialog.updateSuccessSnackbarMsg
            ) : (
              Content('en').pages.admin.users.manage.editUserDialog.updateFailureSnackbarMsg
            )
          }
        </Alert>
      </Snackbar>
      <EditUserDialog
        open={isDialogOpen}
        onClose={closeDialog}
      >
        <UserForm
          userDetails={selectedUserDetails}
          updateFirstName={(e) => {
            debounce(handleUpdateFirstName(e))
          }}
          updateLastName={(e) => {
            debounce(handleUpdateLastName(e))
          }}
          errors={selectedUserErrors}
          existingPerms={selectedUserDetails.permissions}
          updatePermissions={(e) => {
            debounce(updatePermissions(e))
          }}
          toggleAccStatus={toggleAccountStatus}
          clearForm={closeDialog}
          submitForm={() => { submitForm() }}
          isCancelDisabled={isBtnsDisabled}
          isSubmitDisabled={
            isBtnsDisabled || 
            !checkEditUserDetailsValid()
          }
          setMaxWidth={true}
        />
      </EditUserDialog>
      <div className={classes.root}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              columns={cols}
              rows={rows}
              rowCount={
                Object.keys(userMetadata).length > 0 ? userMetadata.totalUserCount : 0
              }
              page={currPageRef.current + 1}
              onPageChange={(params) => { handlePageChange(params.page) }}
              pageSize={NUM_USERS_ON_PAGE}
              pagination
              paginationMode="server"
              loading={!isDisplayReady}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ManageUsers;
