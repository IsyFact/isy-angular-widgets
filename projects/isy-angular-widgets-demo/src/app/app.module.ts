import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HauptfensterModule} from '../../../isy-angular-widgets/src/lib/hauptfenster/hauptfenster.module';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {AuthGuard} from '../../../isy-angular-widgets/src/lib/security/security-guard';
import {UserInfoService} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityModule} from '../../../isy-angular-widgets/src/lib/security/security.module';
import {PanelMenuModule} from 'primeng/panelmenu';
import {FormsModule} from '@angular/forms';
import {RadioButtonModule} from 'primeng/radiobutton';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AccordionModule} from "primeng/accordion";
import {DropdownModule} from "primeng/dropdown";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HauptfensterModule,
    BrowserAnimationsModule,
    CoreModule,
    SecurityModule,
    SharedModule,
    ButtonModule,
    ToolbarModule,
    PanelMenuModule,
    HttpClientModule,
    RadioButtonModule,
    FormsModule,
    AccordionModule,
    DropdownModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
  ],
  providers: [AuthGuard, UserInfoPublicService, {provide: UserInfoService, useClass: UserInfoPublicService}, SecurityService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
