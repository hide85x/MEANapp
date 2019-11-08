import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Post } from "../post-model";
import { PostsService } from '../posts.service'
import { Observable, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    //    @Input()
    // dzieki Input mamy dostep do tych danych z poziomu componentu rodzica(appComp) i tylko z niego!

    postsLength = 0;
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    userId: string;

    private postsSub: Subscription;

    private authListenenerSubs: Subscription;
    public userIsAuth = false;

    //public stworzy nam props naszej klasy o nazwie postsService i ustawi jej typ na PostService
    constructor(public postsService: PostsService, private authService: AuthService) { }

    ngOnInit() {


        // wszystkie initialization taski wykonujemy tutaj
        this.isLoading = true;
        this.userId= this.authService.getUserId()
        // dzieki public w construc. mamy tutaj elegancko dostep do serwisu
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostsUpdateListener()
            .subscribe((postsData: {
                posts: Post[],
                postCount: number
            }) => {
                this.isLoading = false;
                this.posts = postsData.posts;
                this.totalPosts = postsData.postCount
            });
        //subscribe ma trzy args ( funkcje ktora sie odpali przy kazdym wyemitowanym data, drugi to error( ) błąd,
        // trzeci funkcja complete() gdzie skonczylismy podawac observable)

        this.userIsAuth= this.authService.getIsAuth()

        console.log(this.userIsAuth)
        this.authListenenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                console.log(isAuthenticated)
                this.userIsAuth = isAuthenticated;
                this.authService.getIsAuth();
                this.userId= this.authService.getUserId()

            })
    }
    //zeby uniknac memory leaks
    //jako ze nasza subskrypcja nie wylaczala sie nawet przy wylaczeniu componentu

    //dlatego mamy to:
    ngOnDestroy() {
        this.authListenenerSubs.unsubscribe();
        this.postsSub.unsubscribe();
    }
    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId)
            .subscribe(() => {
                this.postsService.getPosts(this.postsPerPage, this.currentPage - 1)
            })

    }
    onChangePage(pageData: PageEvent) {
        console.log(pageData);
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage)

    }
}
