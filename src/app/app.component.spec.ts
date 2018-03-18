import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";
import { AppComponent } from "./app.component";
import { SharedModule } from "shared/shared.module";
import { LogModule } from "modules/log/log.module";
import { UIModule } from "modules/ui/ui.module";
import { AppRoutingModule } from "core/app-routing.module";
import { GraphqlModule } from "core/graphql.module";
import { MaterialModule } from "core/material.module";

describe("AppComponent", () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          SharedModule,
          LogModule,
          UIModule,

          AppRoutingModule,
          GraphqlModule,
          MaterialModule
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppComponent);
          app = fixture.debugElement.componentInstance;
        });
    })
  );
  it(
    "should create the app",
    async(() => {
      expect(app).toBeTruthy();
    })
  );
});
