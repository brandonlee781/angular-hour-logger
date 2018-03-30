import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import { MaterialModule } from '../../../../core/material.module';
import { MenuToggleButtonComponent } from './menu-toggle-button.component';

storiesOf('MenuToggleButton', module)
  .addDecorator(
    moduleMetadata({
      imports: [MaterialModule, HttpClientModule],
      declarations: [MenuToggleButtonComponent],
      providers: [MatIconRegistry],
    }),
  )
  .add('base', () => ({
    component: MenuToggleButtonComponent,
    props: {
      buttonClicked: event => console.log(event),
    },
  }));
