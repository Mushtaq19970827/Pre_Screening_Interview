import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { CandidateDashboardComponent } from './pages/candidate-dashboard/candidate-dashboard.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AssignedInterviewComponent } from './pages/candidate-dashboard/assigned-interview/assigned-interview.component';
import { ScoresComponent } from './pages/candidate-dashboard/scores/scores.component';
import { ProfileComponent } from './pages/candidate-dashboard/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssignInterviewsComponent } from './pages/admin-dashboard/assign-interviews/assign-interviews.component';
import { FilterTopCandidatesComponent } from './pages/admin-dashboard/filter-top-candidates/filter-top-candidates.component';
import { UserDetailsComponent } from './pages/admin-dashboard/user-details/user-details.component';
import { InterviewScreenComponent } from './pages/candidate-dashboard/interview-screen/interview-screen.component';
import { InterviewComponent } from './pages/admin-dashboard/interview/interview.component';

export const routes: Routes = [
    {
        path: "",
        component: LandingPageComponent,
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent,
        pathMatch: "full"
    },
    {
        path: "signup",
        component: SignUpComponent,
        pathMatch: "full"
    },
    {
        path: "candidate",
        component: CandidateDashboardComponent,
        children: [
            {
                path: "interview",
                component: InterviewScreenComponent,
            },
            {
                path: "assigned-interviews",
                component: AssignedInterviewComponent,
            },
            {
                path: "scores",
                component: ScoresComponent,
            },
            {
                path: "profile",
                component: ProfileComponent,
            },
            {
                path: "",
                redirectTo: "assigned-interviews",
                pathMatch: "full"
            }
        ]
    }, {
        path: "admin",
        component: AdminDashboardComponent,
        children: [
            {
                path: "profile",
                component: ProfileComponent
            },
            {
                path: "assign-interviews",
                component: AssignInterviewsComponent
            },
            {
                path: "filter-top-candidates",
                component: FilterTopCandidatesComponent
            },
            {
                path: "user-details",
                component: UserDetailsComponent
            },
            {
                path: "interview",
                component: InterviewComponent
            },
            {
                path: "",
                redirectTo: "assign-interviews",
                pathMatch: "full"
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
