import React from 'react';
import {{componentName}} from '../{{componentName}}';
import { storiesOf } from '@storybook/react';

storiesOf(`{{componentName}}`, module)
  .add('with steve', () => <{{componentName}} owner='steve' />)
  .add('with natalia', () => <{{componentName}} owner='natalia' />)
