import PageAuth from '@/components/Auth/PageAuth';
import permissions from '@/permissions';
import Fragrances from '@/components/Fragrances';

const FragrancesToolkitPage = () => {
  return (
    <Fragrances />
  );
};

const AuthFragrancesToolkitPage = () => {
  return (
    <PageAuth ProtectedComponent={FragrancesToolkitPage} isContentProtected={true} permType={permissions.fragrances} />
  )
}

export default AuthFragrancesToolkitPage;
