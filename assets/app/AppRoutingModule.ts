import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogTagsComponent } from './components/BlogTagsComponent';
import { BlogComponent }   from './components/BlogComponent';
import { BlogArticleComponent }   from './components/BlogArticleComponent';


const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'tags/:tid', component: BlogTagsComponent },
    { path: 'tags/:tid/:page', component: BlogTagsComponent },
    { path: 'main',  component: BlogComponent },
    { path: 'main/:page',  component: BlogComponent },
    { path: 'article/:nid', component: BlogArticleComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}