import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { WithToggle, WithToggleContents, WithToggleTrigger } from './WithToggle';

const components = storiesOf('libs', module);
components.add('WithToggle', () => {
    return (
        <WithToggle>
            <WithToggleTrigger>trigger</WithToggleTrigger>
            <WithToggleContents>contents</WithToggleContents>
        </WithToggle>
    );
});
