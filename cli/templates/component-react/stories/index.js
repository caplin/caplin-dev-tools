import React from 'react';
import Component from '../react-component';
import { storiesOf } from '@storybook/react';

storiesOf('Tweet', module)
  .add('with steve', () => <Component owner='steve' />)
  .add('with natalia', () => <Component owner='natalia' />)