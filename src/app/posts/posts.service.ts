import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post-model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' }) // pozwala nam korzystac z servicu w kazdym komponencie Z TEJ SAMEJ INSTANCJI SERWISU!
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>()
    // nasz subject jest obiektem js i do takiego musimy sie subsrybowac w postListcomponent

    constructor(private http: HttpClient, private router: Router, public authService: AuthService) { }

    getPost(id: string) {
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
        }>
            ('http://localhost:3000/api/posts/' + id);
    }
    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, posts: any, count: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((postData) => { // zadziala na naszym streamie danych
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        }
                    }),
                    count: postData.count
                };
            })
            )
            .subscribe((transformedPostsData) => {
                this.posts = transformedPostsData.posts
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPostsData.count
                })
            });

        //nie musimy przy http cilent unscubscrivowac, zrobi to za nas angular
        // return [...this.posts]
        // kopiujemy posty przez dodanie spreadoperatora
        // inaczej skopiowalibysmy tylko reference do postow czyli niekoniecznie to co chcielibysmy
        // nie chcemy zeby ktos mial dostep i modufikowal nasz obiekt post
    }
    getPostsUpdateListener() {
        //tu mozemy go nasluchiwac, ale nie mozemy emitowac nasze zupdateowane posty
        //mozemy emitowac z addPost
        return this.postsUpdated.asObservable()
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        //generalnie sprawdzamy czym jest nasz image, jesli jest objectem : 
        if (typeof (image) === "object") {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
            //lub jest stringiem
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            };
        }




        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((results => {
                // const updatedPosts = [...this.posts]
                // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                // const post: Post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imagePath: "" //results.imagePath
                // }
                // updatedPosts[oldPostIndex] = post; // ta metoda zostala dla picu, updteujemy post na sererze app.js
                // // console.log(updatedPosts[oldPostIndex])
                // this.posts = updatedPosts;
                // // console.log(this.posts)
                // this.postsUpdated.next([...this.posts]);

                this.router.navigate(['/']);

            }))
    }

    //po dodaniu posta i nie odsiezaniu www, nasz post ma id:null tak jak podajemy w zmiennej post
    //zeby miec od razu id z mongoDb, mozemy albo na koncu addPost, odpalic getPosts(ale to gupie)
    addPost(title: string, content: string, image: File) {
        // const post: Post= {id: null, title: title , content:content}; nie obsluzy nam pliku załaczonego

        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title); // image musi zgadzac sie z podanym w routes post multer.single()

        this.http
            .post<{ message: string, post: Post }>
            ('http://localhost:3000/api/posts', postData)
            .subscribe((results) => {
                // const post: Post = {
                //     id: results.post.id,
                //     title: title,
                //     content: content,
                //     imagePath: results.post.imagePath

                // }
                // console.log(results.message)
                // this.posts.push(post)

                // //skomplikowane... 
                // // za kazdym razem gdy dodajemy post do posts, nasz subject (postsUpdated) emituje zupdateowana liste postow
                // //musimy teraz ustawic listener do niego, jako ze jest prywatny to se tak o nie mozemy... dlatego mamy getPostsUpdate....
                // this.postsUpdated.next([...this.posts])
                // zakomentiwlismy poniewaz na koncy logiki i tak nagigujemy do postlistcomponent a on na ngOninit pobiera aktualna wersje postów
                this.router.navigate(['/']);

            });
    }

    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId)
        //
        //subskruujemy sie do observanbla w komponencie (onDelete()) zamiast w serwisie tutaj, ale musimy go zwrócić returnem
        // .subscribe(() => {
        //     console.log('post deleted! msg from angular')
        //     const updatedPosts = this.posts.filter(post => post.id !== postId)
        //     this.posts = updatedPosts;
        //     this.postsUpdated.next([...this.posts])
        // })
    }
}






// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// // import { any } from './server-answer';

// @Injectable({
//     providedIn: 'root'
// })

// export class PostService{

//     constructor(private http: HttpClient){

//     }
//     getPosts():Observable<any>{
//         return this.http.get<any>("http://localhost:8080/feed/posts");
//     }
// }