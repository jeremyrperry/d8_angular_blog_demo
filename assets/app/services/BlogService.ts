import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BlogService{
    private apiEndpoint = '/api/blog/angular-blog-demo/';
    private article_count = 0;
    private total_pages = 1;
    private featured_articles = {};
    private articles = {};
    private pages = {};
    private tags = [];
    constructor(private http: Http){}

    private fetchBlog(page: number): Promise<{}>{
        const offset = page*10
        return this.http.get(this.apiEndpoint+'main/'+offset)
            .toPromise()
            .then(res =>{
                const data = res.json();
                this.articles = Object.assign(this.articles, data.articles);
                this.featured_articles = Object.assign(this.featured_articles, data.featured_articles);
                this.article_count = data.article_count;
                this.total_pages = Math.ceil(this.article_count/10);
                this.pages[page] = Object.keys(data.articles);
                this.tags = data.tags;
                return {
                    total_pages: this.total_pages,
                    articles: this.getArticlesByPage(page),
                    featured_articles: this.getFeaturedArticles()
                };
            });
    }

    private findBlogArticle(nid: number): any{
        if(this.articles.hasOwnProperty(nid)){
            return this.articles[nid];
        }
        else if(this.featured_articles.hasOwnProperty(nid)){
            return this.featured_articles[nid];
        }
        return null;
    }

    private fetchBlogArticle(nid: number): Promise<any>{
        return this.http.get(this.apiEndpoint+'article/'+nid)
            .toPromise()
            .then(res =>{res.json()});
    }

    private getTag(tid: number): any{
        const tags = this.tags.filter(tags=>{
            return parseInt(tags.tid) == tid;
        })[0];
        if(typeof(tags) == 'object'){
            return tags;
        }
        return null;
    }

    private getFeaturedArticles(): any{
        return Object.keys(this.featured_articles).reduce((arr, nid) => {
            arr.push(this.featured_articles[nid]);
            return arr;
        }, []);
    }

    private getArticlesByPage(page: number): any{
        return this.pages[page].reduce((arr, nid) => {
            arr.push(this.articles[nid]);
            return arr;
        }, []);
    }

    getBlog(page: number): Promise<{}> {
        return new Promise(resolve => {
            if(this.pages.hasOwnProperty(page)){
                resolve({
                    total_pages: this.total_pages,
                    articles: this.getArticlesByPage(page),
                    featured_articles: this.getFeaturedArticles()
                });
            }
            else{
                resolve(this.fetchBlog(page));
            }
        });
    }

    getBlogArticle(nid: number): Promise<{}>{
        return new Promise(resolve =>{
            const article = this.findBlogArticle(nid);
            if(article){
                resolve({
                    article: article,
                    tags: this.getTag(article.field_tags[0].target_id)
                });
            }
            else{
                resolve(this.fetchBlogArticle(nid));
            }
        });
    }

    getTagName(tid: number): any{
        const tags = this.tags.filter(tags=>{
            return parseInt(tags.tid) == tid;
        })[0];
        if(typeof(tags) == 'object'){
            if(tags.hasOwnProperty('name')) {
                return tags.name;
            }
        }
        return 'Unknown';
    }
}
