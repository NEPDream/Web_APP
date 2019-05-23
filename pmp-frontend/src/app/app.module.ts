import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { IssuesComponent } from './issues/issues.component';
import { SprintsComponent } from './sprints/sprints.component';
import { ChatsComponent } from './chats/chats.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule, NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { ToastrModule } from 'ngx-toastr';
import { IssuePipePipe } from './pipes/issue-pipe.pipe';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MessageslistPipe } from './pipes/messageslist.pipe';
import { MomentModule } from 'angular2-moment';
import { CompanyComponent } from './company/company.component';
import { ProjectComponent } from './project/project.component';
import { EmployeeComponent } from './employee/employee.component';
import { RolesComponent } from './roles/roles.component';
import { AccountComponent } from './account/account.component';
import { ListfilterPipe } from './pipes/listfilter.pipe';
import { TeamComponent } from './team/team.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SequentialPipe } from './pipes/sequential.pipe';
import { SprintPipe } from './pipes/sprint.pipe';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { StatsComponent } from './stats/stats.component';
// import { ChartModule } from 'angular-highcharts';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AuthComponent,
    IssuesComponent,
    SprintsComponent,
    ChatsComponent,
    AdminComponent,
    IssuePipePipe,
    MessageslistPipe,
    CompanyComponent,
    ProjectComponent,
    EmployeeComponent,
    RolesComponent,
    AccountComponent,
    ListfilterPipe,
    TeamComponent,
    SequentialPipe,
    SprintPipe,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AngularFontAwesomeModule,
    NgbModule,
    NgbPaginationModule, 
    NgbAlertModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      toastClass: 'toast toast-bootstrap-compatibility-fix'
    }),
    ScrollToModule.forRoot(),
    MomentModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxEmojiPickerModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
