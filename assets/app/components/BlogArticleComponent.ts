import {Component, OnInit}  from "@angular/core";
import { ActivatedRoute }   from '@angular/router';
import { Location }         from  '@angular/common';

import { BlogService } from '../services/BlogService';

@Component({
    selector: 'blog-article',
    templateUrl: './../templates/BlogArticleTemplate.html'
})

export class BlogArticleComponent implements OnInit{
    tags = {};
    article = {};
    title = 'Blog Title';
    body = 'Blog body';
    tags_name = 'Blog tags';
    tags_id = 0;

    constructor(
        private blogService: BlogService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {
        const nid = this.route.snapshot.params['nid'];
        this.blogService.getBlogArticle(nid)
            .then((res)=>{
                console.log('done', res);
                this = Object.assign(this, res);
                this.title = this.article.title[0].value;
                this.body = this.article.body[0].value;
                this.tags_id = this.tags.tid;
                this.tags_name = this.tags.name;
            });
    }
}