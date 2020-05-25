import React from 'react';
import { render } from '@testing-library/react';
import MapBuilder from './MapBuilder';

jest.mock('./Options')
    .mock('./Map');

test('renders title', () => {
  const { getByText } = render(<MapBuilder />);
  const linkElement = getByText(/Map Builder/i);
  expect(linkElement).toBeInTheDocument();
});
