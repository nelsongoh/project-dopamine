import React from 'react';

// Using the render and screen functions from the utility file
// instead of the default provided by @testing-library/react
import { render, screen } from '../test-utils';
import HomePage from '@/pages/index';

describe("HomePage", () => {
  // Checking for the index page's title
  it("should render the home page title", () => {
    render(<HomePage />);

    const title = screen.getByText(
      "Welcome to the Playground"
    );

    expect(title).toBeInTheDocument();
  })
});