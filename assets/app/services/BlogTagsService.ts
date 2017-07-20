import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BlogTagService{
    private apiEndpoint = '/api/blog/angular-blog-demo/tags/';
    private article_count = 0;
    private total_pages = 1;
    private articles = {};
    private pages = {};
    private tags = {};

    constructor(private http: Http){}

    private fetchArticles(tid: number, page: number): Promise<any>{
        const offset = page * 10;
        return this.http.get(this.apiEndpoint+tid+'/'+offset)
            .toPromise()
            .then(res =>{
                const data = res.json();
                console.log('in', data);
                this.articles = Object.assign(this.articles, data.articles);
                this.article_count = data.article_count;
                this.total_pages = Math.ceil(this.article_count/10);
                this.pages[page] = Object.keys(data.articles);
                this.tags = data.tags;
                return {
                    total_pages: this.total_pages,
                    articles: this.getArticlesByPage(page),
                    tags: this.tags
                };
            });
    }

    private getArticlesByPage(page: number): any{
        return this.pages[page].reduce((arr, nid) => {
            arr.push(this.articles[nid]);
            return arr;
        }, []);
    }


    getArticles(tid: number, page: number): Promise<any> {
        return new Promise(resolve => {
            if(this.pages.hasOwnProperty('page')){
                resolve({
                    total_pages: this.total_pages,
                    articles: this.getArticlesByPage(page),
                    tags: this.tags
                });
            }
            else{
                resolve(this.fetchArticles(tid, page));
            }
        });
    }
}
