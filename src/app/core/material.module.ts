import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatDatetimepickerModule,
  MatNativeDatetimeModule,
} from '@mat-datetimepicker/core';

@NgModule({
  imports: [
    // BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    FlexLayoutModule,
  ],
  exports: [
    // BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    FlexLayoutModule,
  ],
})
export class MaterialModule {}
