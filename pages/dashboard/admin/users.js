import { Fragment, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PageAuth from '@/components/Auth/PageAuth';
import permissions from '@/permissions';
import Content from '@/content';
import RegisterNewUser from '@/components/Register';
import ManageUsers from '@/components/Form/Manage';

const TabPanel = ({ ChildComponent, value, index }) => (
  value === index ? <ChildComponent /> : null
);

const DashboardAdminUsers = () => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const [currTab, setCurrTab] = useState(0);
  const changeTab = (event, newTabIdx) => {
    setCurrTab(newTabIdx);
  }

  return (
    <Fragment>
      <Tabs
        value={currTab}
        onChange={changeTab}
        centered={!isMobileView ? true : false}
        variant={isMobileView ? "fullWidth" : "standard"}
      >
        <Tab label={Content('en').pages.admin.users.tabs.create} value={0} />
        <Tab label={Content('en').pages.admin.users.tabs.manage} value={1} />
      </Tabs>
      <TabPanel ChildComponent={RegisterNewUser} value={currTab} index={0} />
      <TabPanel ChildComponent={ManageUsers} value={currTab} index={1} />
    </Fragment>
  );
};

const AuthAdminUsers = () => {
  return (
    <PageAuth ProtectedComponent={DashboardAdminUsers} isContentProtected={true} permType={permissions.admin} />
  )
}

export default AuthAdminUsers;
