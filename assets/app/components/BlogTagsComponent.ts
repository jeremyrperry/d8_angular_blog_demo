import {Component, OnInit} from "@angular/core";
import { ActivatedRoute }   from '@angular/router';

import { BlogTagService } from '../services/BlogTagsService';

@Component({
    selector: 'blog-tags',
    templateUrl: './../templates/BlogTagsTemplate.html'
})

export class BlogTagsComponent implements OnInit{
    page = 0;
    articles = [];
    tags = 'tags';
    total_pages = new Array(0);
    tid = 0;

    constructor(
        private blogTagService: BlogTagService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const params = this.route.snapshot.params;
        this.tid = params['tid'];
        this.page = (params.hasOwnProperty('page') ? params['page'] : 0);
        this.blogTagService.getArticles(this.tid, this.page)
            .then((res)=>{
                this.total_pages = new Array(res.total_pages);
                this.tags = res.tags.name[0].value;
                this.articles = res.articles;
            });
    }
}