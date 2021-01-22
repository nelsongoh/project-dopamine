import PageAuth from '../../src/components/Auth/PageAuth';

const Calendar = () => {
  return (
    <h1>This is a calendar</h1>
  )
};

const AuthCalendar = () => {
  return (
    <PageAuth ProtectedComponent={Calendar} isContentProtected={true} />
  )
}

export default AuthCalendar;
