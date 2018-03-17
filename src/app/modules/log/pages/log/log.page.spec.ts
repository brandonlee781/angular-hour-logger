import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogPage } from './log.page';

import { SharedModule } from 'shared/shared.module';
import { MaterialModule } from 'core/material.module';
import { LogListComponent } from '../../components/log-list/log-list.component';
import { LogListItemComponent } from '../../components/log-list-item/log-list-item.component';
import { GraphqlModule } from 'core/graphql.module';
import { Apollo } from 'apollo-angular';
import { MatIconRegistry } from '@angular/material';

describe('LogPage', () => {
  let component: LogPage;
  let fixture: ComponentFixture<LogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogPage, LogListComponent, LogListItemComponent ],
      imports: [ SharedModule, MaterialModule, GraphqlModule ],
      providers: [Apollo, MatIconRegistry]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LogPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should have a list of links', () => {
    fixture.whenStable().then(() => {
      component.links$.subscribe(links => {
        expect(links).toBeTruthy();
        expect(Array.isArray(links)).toBe(true);
      });
    });
  });

  it('should have a default link', () => {
    fixture.whenStable().then(() => {
      component.links$.subscribe(links => {
        expect(links).toEqual(
          expect.arrayContaining([{
            text: 'Recent Log Entries',
            id: 'recent',
            icon: '',
            isSelected: true,
          }])
        );
      });
    });
  });
});
