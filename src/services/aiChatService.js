import { BehaviorSubject } from "rxjs";
import { usersAPI } from "../services/api";

class AiChatService {
    // reactive state
    aiSessions$ = new BehaviorSubject([]);
    selectedSession$ = new BehaviorSubject(null);
    sessionDetail$ = new BehaviorSubject(null);
    chatMessages$ = new BehaviorSubject([]);
    isLoading$ = new BehaviorSubject(false);
    isSending$ = new BehaviorSubject(false);

    // fetch all AI sessions
    async fetchAiSessions(){
        try{
            console.log('[REACTIVE]  Fetching AI chat sessions...');
            this.isLoading$.next(true);
            const response = await usersAPI.getAiSessions();
            
            this.aiSessions$.next(response.data.data);
            console.log('[REACTIVE]  AI sessions emitted to stream:', response.data.data.length, 'sessions');
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error fetching AI sessions:', error.message);
        }finally{
            this.isLoading$.next(false);
        }
    }

    // fetch specific session detail
    async fetchAiSessionDetail(id){
        try{
            console.log('[REACTIVE]  Fetching AI session detail:', id);
            this.isLoading$.next(true);
            const response = await usersAPI.getAiSessionDetail(id);
            
            this.sessionDetail$.next(response.data.session);
            this.chatMessages$.next(response.data.messages || []);
            console.log('[REACTIVE]  Session detail emitted to stream:', response.data.session?.title);
            console.log('[REACTIVE]  Chat messages loaded:', response.data.messages?.length || 0, 'messages');
            return response.data.session;
        }catch(error){
            console.error('[REACTIVE]  Error fetching session detail:', error.message);
        }finally{
            this.isLoading$.next(false);
        }
    }

    // send chat message
    async sendAiChat(data){
        try{
            console.log('[REACTIVE] Sending chat message...');
            this.isSending$.next(true);
            const response = await usersAPI.sendAiChat(data);
            
            // update session detail
            this.sessionDetail$.next(response.data.session);
            
            // update chat messages
            const currentMessages = this.chatMessages$.getValue();
            const newMessages = response.data.messages || [];
            const updatedMessages = [...currentMessages, ...newMessages];
            this.chatMessages$.next(updatedMessages);
            
            console.log('[REACTIVE] Chat message sent and emitted to stream');
            console.log('[REACTIVE] Total messages now:', updatedMessages.length);
            return response.data;
        }catch(error){
            console.error('[REACTIVE] Error sending chat:', error.message);
            throw error;
        }finally{
            this.isSending$.next(false);
        }
    }

    // delete AI session
    async deleteAiSession(id){
        try{
            console.log('[REACTIVE] Deleting AI session:', id);
            this.isLoading$.next(true);
            await usersAPI.deleteAiSession(id);
            
            // remove session from list
            const currentSessions = this.aiSessions$.getValue();
            const updatedSessions = currentSessions.filter(session => session.id !== id);
            this.aiSessions$.next(updatedSessions);
            
            // clear detail if it's the deleted session
            if(this.sessionDetail$.getValue()?.id === id){
                this.sessionDetail$.next(null);
                this.chatMessages$.next([]);
            }
            
            console.log('[REACTIVE] AI session deleted and removed from stream');
            return true;
        }catch(error){
            console.error('[REACTIVE] Error deleting AI session:', error.message);
            throw error;
        }finally{
            this.isLoading$.next(false);
        }
    }

    // select session
    selectSession(session){
        this.selectedSession$.next(session);
        console.log('[REACTIVE] Session selected:', session.id);
        this.fetchAiSessionDetail(session.id);
    }

    // clear current session
    clearSession(){
        this.sessionDetail$.next(null);
        this.chatMessages$.next([]);
        this.selectedSession$.next(null);
        console.log('[REACTIVE] Current session cleared');
    }
}

export default new AiChatService();
