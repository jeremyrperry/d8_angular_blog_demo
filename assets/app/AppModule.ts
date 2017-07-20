import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule }      from '@angular/core';

import { AppComponent } from './components/AppComponent';
import { AppRoutingModule }     from './AppRoutingModule';
import { BlogTagsComponent } from './components/BlogTagsComponent';
import { BlogTagService } from './services/BlogTagsService';
import { BlogComponent }  from './components/BlogComponent';
import { BlogArticleComponent } from './components/BlogArticleComponent';
import { BlogService } from './services/BlogService';

@NgModule({
    imports:      [ AppRoutingModule, BrowserModule, HttpModule ],
    declarations: [ AppComponent, BlogTagsComponent, BlogComponent, BlogArticleComponent ],
    bootstrap:    [ AppComponent ],
    providers:    [ BlogTagService, BlogService ]
})
export class AppModule { }