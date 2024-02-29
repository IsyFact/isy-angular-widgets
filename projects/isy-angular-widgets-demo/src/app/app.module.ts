import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HauptfensterModule} from '@isy-angular-widgets/hauptfenster/hauptfenster.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {SecurityService} from '@isy-angular-widgets/security/security-service';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';
import {UserInfoService} from '@isy-angular-widgets/api/userinfo';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelMenuModule} from 'primeng/panelmenu';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MenuTranslationService} from './shared/services/menu-translation.service';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {SeitentoolbarComponent} from '@isy-angular-widgets/seitentoolbar/seitentoolbar.component';

@NgModule({
  declarations: [AppComponent],
  providers: [
    AuthGuard,
    UserInfoPublicService,
    {provide: UserInfoService, useClass: UserInfoPublicService},
    SecurityService,
    MenuTranslationService,
    MessageService
  ],
  bootstrap: [AppComponent],
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
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
    SeitentoolbarComponent
  ]
})
export class AppModule {}
