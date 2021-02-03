import { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import useStyles from './manageUsersStyles';
import LoginContext from '../../../contexts/login';
import { useGetUsers, useGetUserMetadata } from '../../../../lib/client/useUsers';
import LoadingScreen from '../../Loading/loading';
import Router from 'next/router';
import routes from '../../../routes';
import Content from '../../../lang';

const ManageUsers = () => {
  const classes = useStyles();
  const { user } = useContext(LoginContext);
  const [rows, setRows] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const NUM_USERS_RETRIEVE = 100;
  const metadataOutcome = useGetUserMetadata(user);

  const transformRowsForGrid = (retrievedData) => {
    return retrievedData.map((retrievedUser, idx) => (
      {
        id: idx + rows.length,
        email: retrievedUser.email,
        firstName: retrievedUser.firstName,
        lastName: retrievedUser.lastName,
        isEnabled: retrievedUser.isAccEnabled,
      }
    ))
  };

  useEffect(() => {
    const initDataRetrieval = async () => {
      setIsLoadingData(true);
      await fetchUserData();
      setIsLoadingData(false);
    }
    initDataRetrieval();
  }, []);

  const fetchUserData = async () => {    
    const getUsersOutcome = await useGetUsers(user, nextPageToken, NUM_USERS_RETRIEVE);
    if (!getUsersOutcome.success) {
      console.log("Something has gone wrong with retrieving the user information for the 'Manage Users' tab in the admin panel.");
      console.log("Something's gone wrong with the user data retrieval.");
      Router.push(routes.protected[1337].url);
      return <LoadingScreen />;
    }

    if (getUsersOutcome.data) {
      setNextPageToken(getUsersOutcome.nextPageToken);
      setRows([...rows, ...transformRowsForGrid(getUsersOutcome.data.users)]);
    }
  };

  const [currMaxPage, setCurrMaxPage] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  
  const handlePageChange = async (page) => {
    // If the page we want to switch to is beyond our current max page,
    // we need to retrieve more data
    if (page > currMaxPage) {
      // Set the data grid to loading
      setIsLoadingData(true);
      // Retrieve data
      await fetchUserData();
      // Update the page and max page
      setCurrMaxPage(currMaxPage + 1);
      setCurrPage(page);
      // Set the data grid to not loading
      setIsLoadingData(false);
    } else {
      // Else we just set the page number
      setCurrPage(page);
    }
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
          >
            {Content('en').pages.admin.users.manage.cols.headers.edit.btn}
          </Button>
        );
      },
      flex: 0.2,
    },
  ];

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            columns={cols}
            rows={rows.slice((currPage - 1) * NUM_USERS_RETRIEVE, currPage * NUM_USERS_RETRIEVE)}
            rowCount={
              !metadataOutcome.isLoading && !metadataOutcome.isError ? metadataOutcome.content.totalUserCount : 0
            }
            page={currPage}
            onPageChange={(params) => { handlePageChange(params.page) }}
            pageSize={NUM_USERS_RETRIEVE}
            pagination
            paginationMode="server"
            loading={isLoadingData}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
