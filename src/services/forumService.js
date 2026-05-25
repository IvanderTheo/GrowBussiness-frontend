import { BehaviorSubject } from "rxjs";
import { publicApi } from "../services/api";
import { usersAPI } from "../services/api";

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
            console.log('[REACTIVE]  Fetching forum categories...');
            const response =
                await publicApi.getForumCategory();
            const categories =
                response.data.data;
            this.category$.next(
                categories
            );
            console.log('[REACTIVE]  Categories emitted to stream:', categories.length, 'items');
            // default category pertama
            if(categories.length>0){
                const first =
                    categories[0];
                this.selectedCategory$.next(
                    first
                );
                console.log('[REACTIVE]  Default category set:', first.name);
                this.fetchForum(
                    first.slug
                );
            }
        }catch(error){
            console.error('[REACTIVE]  Error fetching categories:', error.message);
        }
    }

    // forum list
    async fetchForum(slug){
        try{
            console.log('[REACTIVE] Fetching forum list for category:', slug);
            const response =
                await publicApi.getForum(slug);

            this.forum$.next(
                response.data.data.data
            );
            console.log('[REACTIVE] Forum list emitted to stream:', response.data.data.data.length, 'items');
        }catch(error){
            console.error('[REACTIVE]  Error fetching forum:', error.message);
        }
    }
    
    // forum detail
    async fetchForumDetail(id){
        try{
            console.log('[REACTIVE]  Fetching forum detail:', id);
            const response =
                await publicApi.getForumDetail(id);

            this.forumDetail$.next(
                response.data.data
            );
            console.log('[REACTIVE]  Forum detail emitted to stream:', response.data.data.title);
        }catch(error){
            console.error('[REACTIVE]  Error fetching forum detail:', error.message);
        }
    }

    // post forum
    async postForum(data){
        try{
            console.log('[REACTIVE] Posting new forum thread:', data.title);
            const response = await usersAPI.postForum(data);
            
            // update forum list dengan data baru
            const currentForum = this.forum$.getValue();
            const updatedForum = [response.data.data, ...currentForum];
            this.forum$.next(updatedForum);
            
            console.log('[REACTIVE]  New forum posted and emitted to stream');
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error posting forum:', error.message);
            throw error;
        }
    }

    // post comment
    async postComment(forumId, data){
        try{
            console.log('[REACTIVE]  Posting comment on forum:', forumId);
            const response = await usersAPI.postComment(forumId, data);
            
            // update forum detail dengan comment baru
            const currentDetail = this.forumDetail$.getValue();
            if(currentDetail && currentDetail.comments){
                const updatedDetail = {
                    ...currentDetail,
                    comments: [...currentDetail.comments, response.data.data]
                };
                this.forumDetail$.next(updatedDetail);
                console.log('[REACTIVE]  Comment posted and emitted to stream');
            }
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error posting comment:', error.message);
            throw error;
        }
    }

    selectCategory(category){
        this.selectedCategory$.next(
            category
        );
        console.log('[REACTIVE]  Category changed:', category.name);
        this.fetchForum(
            category.slug
        );
    }
} 
export default new ForumService();