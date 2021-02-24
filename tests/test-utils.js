import { render } from "@testing-library/react";
import { ThemeProvider } from '@material-ui/core/styles';
import LoginProvider from '@/providers/login';
import PermissionsProvider from '@/providers/permissions';
import theme from '../src/theme';
import * as nextRouter from 'next/router';

// The mock router for the next/router
const mockRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => (mockRouter));

// Adding in the Providers in the application:
const Providers = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LoginProvider>
        <PermissionsProvider>
          {children}
        </PermissionsProvider>
      </LoginProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options = {}) => (
  render(ui, { wrapper: Providers, ...options })
);

// We re-export everything
export * from "@testing-library/react";

// And override the render method
export { customRender as render };
