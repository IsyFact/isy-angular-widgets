import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HauptfensterModule} from '../../../isy-angular-widgets/src/lib/hauptfenster/hauptfenster.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {AuthGuard} from '../../../isy-angular-widgets/src/lib/security/security-guard';
import {UserInfoService} from '../../../isy-angular-widgets/src/lib/api/userinfo';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelMenuModule} from 'primeng/panelmenu';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MenuTranslationService} from '../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

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
    SharedModule,
    PanelMenuModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthGuard,
    UserInfoPublicService,
    {provide: UserInfoService, useClass: UserInfoPublicService},
    SecurityService,
    MenuTranslationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
