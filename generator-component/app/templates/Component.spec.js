import React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { <%= componentName %> } from './';

describe('<%= componentName %>', () => {
  it('displays Hello', () => {
    const { container } = render(<<%= componentName %> />);
    expect(container).toHaveTextContent('Hello');
  });
});
