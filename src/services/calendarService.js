import { BehaviorSubject } from "rxjs";
import { usersAPI } from "../services/api";

class CalendarService {
    // reactive state
    schedule$ = new BehaviorSubject([]);
    isLoading$ = new BehaviorSubject(false);
    // separate loading state for write operations (POST / PUT / PATCH / DELETE)
    isPostLoading$ = new BehaviorSubject(false);

    // fetch schedule
    async fetchSchedule(){
        try{
            console.log('[REACTIVE] Fetching schedule...');
            // NOTE: GET should not toggle write-loading state. Keep GET quick and silent.
            this.isLoading$.next(true);
            const response = await usersAPI.getSchedule();
            this.schedule$.next(response.data.data);
            console.log('[REACTIVE] Schedule emitted to stream:', response.data.data.length, 'items');
            return response.data.data;
        } catch (error) {
            console.error('[REACTIVE] Error fetching schedule:', error.response?.message);
        } finally {
            this.isLoading$.next(false);
        }
    }

    // post schedule
    async postSchedule(data){
        try{
            console.log('[REACTIVE] Posting new schedule...');
            this.isPostLoading$.next(true);
            const response = await usersAPI.postSchedule(data);

            // add to schedule
            const currentSchedule = this.schedule$.getValue();
            const updatedSchedule = [...currentSchedule, response.data.data];
            this.schedule$.next(updatedSchedule);

            console.log('[REACTIVE]  New schedule posted and emitted to stream');
            return response.data.data;
        } catch (error) {
            console.error('[REACTIVE] Error posting schedule:', error.message);
            throw error;
        } finally {
            this.isPostLoading$.next(false);
        }
    }

    // update schedule (PUT)
    async putSchedule(id, data){
        try{
            console.log('[REACTIVE]  Updating schedule:', id);
            this.isPostLoading$.next(true);
            const response = await usersAPI.putSchedule(id, data);

            // update schedule in list
            const currentSchedule = this.schedule$.getValue();
            const updatedSchedule = currentSchedule.map(item => 
                item.id === id ? response.data.data : item
            );
            this.schedule$.next(updatedSchedule);

            console.log('[REACTIVE]  Schedule updated and emitted to stream');
            return response.data.data;
        } catch (error) {
            console.error('[REACTIVE] Error updating schedule:', error.message);
            throw error;
        } finally {
            this.isPostLoading$.next(false);
        }
    }

    // cancel schedule (PATCH)
    async patchSchedule(id){
        try{
            console.log('[REACTIVE]  Cancelling schedule:', id);
            this.isPostLoading$.next(true);
            const response = await usersAPI.patchSchedule(id);

            // update schedule status
            const currentSchedule = this.schedule$.getValue();
            const updatedSchedule = currentSchedule.map(item => 
                item.id === id ? {...item, current_status: 'cancelled'} : item
            );
            this.schedule$.next(updatedSchedule);

            console.log('[REACTIVE]  Schedule cancelled and emitted to stream');
            return response.data.data;
        } catch (error) {
            console.error('[REACTIVE]  Error cancelling schedule:', error.message);
            throw error;
        } finally {
            this.isPostLoading$.next(false);
        }
    }

    // delete schedule
    async deleteSchedule(id){
        try{
            console.log('[REACTIVE]  Deleting schedule:', id);
            this.isPostLoading$.next(true);
            await usersAPI.deleteSchedule(id);

            // remove from schedule
            const currentSchedule = this.schedule$.getValue();
            const updatedSchedule = currentSchedule.filter(item => item.id !== id);
            this.schedule$.next(updatedSchedule);

            console.log('[REACTIVE]  Schedule deleted and removed from stream');
            return true;
        } catch (error) {
            console.error('[REACTIVE]  Error deleting schedule:', error.message);
            throw error;
        } finally {
            this.isPostLoading$.next(false);
        }
    }

    // get ongoing schedules
    getOngoingSchedules(){
        const schedule = this.schedule$.getValue();
        return schedule.filter(item => item.current_status === "ongoing");
    }

    // clear schedule
    clearSchedule(){
        this.schedule$.next([]);
        console.log('[REACTIVE]  Schedule cleared');
    }
}
export default new CalendarService();