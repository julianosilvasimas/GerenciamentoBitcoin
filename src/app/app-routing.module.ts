import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {IconsComponent} from './utilities/icons.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { CadastroUsuariosComponent } from './cadastro-usuarios/cadastro-usuarios.component';
import { MediaDemoComponent } from './demo/view/mediademo.component';
import { WidgetsComponent } from './utilities/widgets.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: HomeComponent, canActivate: [AuthGuard],},
                    {path: 'carteira', component: CadastroUsuariosComponent},
                    {path: 'dash', component: DashboardDemoComponent},
                    {path: 'utils', component: IconsComponent},
                    {path: 'media', component: WidgetsComponent},
            
                ]
            },
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: 'login', component: LoginComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}



// imports: [
//     RouterModule.forRoot([
//         {
//             path: '', component: AppMainComponent,
//             children: [
//                 {path: '', component: DashboardDemoComponent},
//                 {path: 'uikit/formlayout', component: FormLayoutDemoComponent},
//                 {path: 'uikit/input', component: InputDemoComponent},
//                 {path: 'uikit/floatlabel', component: FloatLabelDemoComponent},
//                 {path: 'uikit/invalidstate', component: InvalidStateDemoComponent},
//                 {path: 'uikit/button', component: ButtonDemoComponent},
//                 {path: 'uikit/table', component: TableDemoComponent},
//                 {path: 'uikit/list', component: ListDemoComponent},
//                 {path: 'uikit/tree', component: TreeDemoComponent},
//                 {path: 'uikit/panel', component: PanelsDemoComponent},
//                 {path: 'uikit/overlay', component: OverlaysDemoComponent},
//                 {path: 'uikit/menu', component: MenusDemoComponent},
//                 {path: 'uikit/media', component: MediaDemoComponent},
//                 {path: 'uikit/message', component: MessagesDemoComponent},
//                 {path: 'uikit/misc', component: MiscDemoComponent},
//                 {path: 'uikit/charts', component: ChartsDemoComponent},
//                 {path: 'uikit/file', component: FileDemoComponent},
//                 {path: 'utilities/display', component: DisplayComponent},
//                 {path: 'utilities/elevation', component: ElevationComponent},
//                 {path: 'utilities/flexbox', component: FlexboxComponent},
//                 {path: 'utilities/grid', component: GridComponent},
//                 {path: 'utilities/icons', component: IconsComponent},
//                 {path: 'utilities/widgets', component: WidgetsComponent},
//                 {path: 'utilities/spacing', component: SpacingComponent},
//                 {path: 'utilities/typography', component: TypographyComponent},
//                 {path: 'utilities/text', component: TextComponent},
//                 {path: 'pages/crud', component: AppCrudComponent},
//                 {path: 'pages/calendar', component: AppCalendarComponent},
//                 {path: 'pages/timeline', component: AppTimelineDemoComponent},
//                 {path: 'pages/invoice', component: AppInvoiceComponent},
//                 {path: 'pages/help', component: AppHelpComponent},
//                 {path: 'pages/empty', component: EmptyDemoComponent},
//                 {path: 'documentation', component: DocumentationComponent}
//             ]
//         },
//         {path: 'error', component: AppErrorComponent},
//         {path: 'access', component: AppAccessdeniedComponent},
//         {path: 'notfound', component: AppNotfoundComponent},
//         {path: 'login', component: AppLoginComponent},
//         {path: '**', redirectTo: '/notfound'},
//     ], {scrollPositionRestoration: 'enabled'})
// ],