import { createContext } from 'react';

const PermissionsContext = createContext({ 
  permissions: null,
  checkPermissions: () => {},
  refreshPermissions: () => {},
});

export default PermissionsContext;
