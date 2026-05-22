import { BehaviorSubject } from "rxjs";
import { usersAPI } from "../services/api";

class CalendarService {
    //reactive state
    schedule$ = new BehaviorSubject([]);

    async fetchSchedule(){
        try{
            const response = await usersAPI.getSchedule();
            this.schedule$.next(
                response.data.data
            )
        } catch (error) {
            console.log(error.response?.message);
        }
    }
}
export default new CalendarService();