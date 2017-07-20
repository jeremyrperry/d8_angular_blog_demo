import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router }   from '@angular/router';

import { BlogService } from '../services/BlogService';

@Component({
    selector: 'blog',
    templateUrl: './../templates/BlogTemplate.html'
})

export class BlogComponent implements OnInit{
    featured_articles = [];
    articles = [];
    total_pages = new Array(0);
    page = 0;
    currentUrl = '';

    constructor(
        private blogService: BlogService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.router.events.subscribe((event) => {
            if(event.hasOwnProperty('urlAfterRedirects') && !event.hasOwnProperty('state')) {
                //TODO: I've been finding that angular doesn't always register a route change when the same component handles the change.  Will need to investigate reason why and potentially implement this event watch further
                const newUrl = event['urlAfterRedirects'];
                if(newUrl != this.currentUrl && this.currentUrl != ''){
                    console.log('will initialize from event watch', event);
                    this.initialize();
                }
                this.currentUrl = newUrl;
            }
        });
    }

    private initialize(): void{
        const params = this.route.snapshot.params;
        this.page = (params.hasOwnProperty('page') ? params['page'] : 0);
        this.blogService.getBlog(this.page)
            .then((res)=>{
                this.total_pages = new Array(res.total_pages);
                this.featured_articles = res.featured_articles;
                this.articles = res.articles;
            });
    }

    getBody(article): any{
        return (article.body[0].summary.length ? article.body[0].summary : article.body[0].value);
    }

    getTagName(tid: number): any{
        return this.blogService.getTagName(tid);
    }

    ngOnInit(): void {
        this.initialize();
    }
}