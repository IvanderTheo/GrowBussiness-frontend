import { BehaviorSubject } from "rxjs";
import { publicApi } from "../services/api";

class ForumService {

    // reactive state
    category$ = new BehaviorSubject([]);
    selectedCategory$ = new BehaviorSubject(null);
    forum$ = new BehaviorSubject([]);
    forumDetail$ = new BehaviorSubject(null);
    comment$ = new BehaviorSubject([]);

    // category
    async fetchCategory(){
        try{
            const response =
                await publicApi.getForumCategory();
            const categories =
                response.data.data;
            this.category$.next(
                categories
            );
            // default category pertama
            if(categories.length>0){
                const first =
                    categories[0];
                this.selectedCategory$.next(
                    first
                );
                this.fetchForum(
                    first.slug
                );
            }
        }catch(error){
            console.log(error);
        }
    }

    // forum list
    async fetchForum(slug){
        try{
            const response =
                await publicApi.getForum(slug);

            this.forum$.next(
                response.data.data.data
            );
        }catch(error){
            console.log(error);
        }

    }
    // forum detail
    async fetchForumDetail(id){
        try{
            const response =
                await publicApi.getForumDetail(id);

            this.forumDetail$.next(
                response.data.data
            );
        }catch(error){
            console.log(error);

        }
    }

    selectCategory(category){
        this.selectedCategory$.next(
            category
        );
        this.fetchForum(
            category.slug
        );
    }
} 
export default new ForumService();