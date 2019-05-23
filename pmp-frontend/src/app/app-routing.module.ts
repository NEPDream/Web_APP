import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IssuesComponent } from './issues/issues.component';
import { SprintsComponent } from './sprints/sprints.component';
import { ChatsComponent } from './chats/chats.component';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { CompanyComponent } from './company/company.component';
import { ProjectComponent } from './project/project.component';
import { EmployeeComponent } from './employee/employee.component';
import { RolesComponent } from './roles/roles.component';
import { AccountComponent } from './account/account.component';
import { TeamComponent } from './team/team.component';
import { AuthGuard } from '../app/guard/auth.guard';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {path:'', component: HomeComponent, canActivate: [AuthGuard]},
  {path:'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path:'issues', component: IssuesComponent, canActivate: [AuthGuard]},
  {path:'sprints', component: SprintsComponent, canActivate: [AuthGuard]},
  {path:'messages', component: ChatsComponent, canActivate: [AuthGuard]},
  {path:'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path:'company', component: CompanyComponent, canActivate: [AuthGuard]},
  {path:'project', component: ProjectComponent, canActivate: [AuthGuard]},
  {path:'employee', component: EmployeeComponent, canActivate: [AuthGuard]},
  {path:'role', component: RolesComponent, canActivate: [AuthGuard]},
  {path:'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path:'stats', component: StatsComponent, canActivate: [AuthGuard]},
  {path:'team', component: TeamComponent, canActivate: [AuthGuard]},
  {path:'login', component: AuthComponent},
  // otherwise redirect to login
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
