import { BehaviorSubject } from "rxjs";
import { usersAPI } from "../services/api";

class CogsCalculatorService {
    // reactive state
    productCategories$ = new BehaviorSubject([]);
    productVariables$ = new BehaviorSubject([]);
    productFixedCosts$ = new BehaviorSubject([]);
    cogsResult$ = new BehaviorSubject(null);
    calculationHistory$ = new BehaviorSubject([]);
    isLoading$ = new BehaviorSubject(false);

    // fetch product categories
    async fetchProductCategories(){
        try{
            console.log('[REACTIVE]  Fetching product categories...');
            this.isLoading$.next(true);
            const response = await usersAPI.getProductCategories();
            
            this.productCategories$.next(response.data.data);
            console.log('[REACTIVE]  Product categories emitted to stream:', response.data.data.length, 'categories');
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error fetching product categories:', error.message);
        }finally{
            this.isLoading$.next(false);
        }
    }

    // post product variables
    async postProductVariables(data){
        try{
            console.log('[REACTIVE]  Posting product variables...');
            this.isLoading$.next(true);
            const response = await usersAPI.postProductVariables(data);
            
            // update product variables
            const currentVariables = this.productVariables$.getValue();
            const updatedVariables = [...currentVariables, response.data.data];
            this.productVariables$.next(updatedVariables);
            
            console.log('[REACTIVE]  Product variable posted and emitted to stream');
            console.log('[REACTIVE]  Total variables now:', updatedVariables.length);
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error posting product variables:', error.message);
            throw error;
        }finally{
            this.isLoading$.next(false);
        }
    }

    // post fixed costs
    async postProductFixedCosts(data){
        try{
            console.log('[REACTIVE] Posting fixed costs...');
            this.isLoading$.next(true);
            const response = await usersAPI.postProductFixedCosts(data);
            
            // update fixed costs
            const currentFixedCosts = this.productFixedCosts$.getValue();
            const updatedFixedCosts = [...currentFixedCosts, response.data.data];
            this.productFixedCosts$.next(updatedFixedCosts);
            
            console.log('[REACTIVE]  Fixed cost posted and emitted to stream');
            console.log('[REACTIVE]  Total fixed costs now:', updatedFixedCosts.length);
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE] Error posting fixed costs:', error.message);
            throw error;
        }finally{
            this.isLoading$.next(false);
        }
    }

    // calculate COGS (Cost of Goods Sold)
    async calculateCogs(data){
        try{
            console.log('[REACTIVE] Calculating COGS (Cost of Goods Sold)...');
            this.isLoading$.next(true);
            const response = await usersAPI.postCogsCalculator(data);
            
            // update COGS result
            this.cogsResult$.next(response.data.data);
            
            // add to calculation history
            const currentHistory = this.calculationHistory$.getValue();
            const updatedHistory = [{
                timestamp: new Date(),
                ...response.data.data
            }, ...currentHistory];
            this.calculationHistory$.next(updatedHistory);
            
            console.log('[REACTIVE]  COGS calculation result emitted to stream');
            console.log('[REACTIVE]  COGS Result:', response.data.data);
            console.log('[REACTIVE]  Calculation history recorded:', updatedHistory.length, 'records');
            return response.data.data;
        }catch(error){
            console.error('[REACTIVE]  Error calculating COGS:', error.message);
            throw error;
        }finally{
            this.isLoading$.next(false);
        }
    }

    // get current COGS result
    getCurrentCogsResult(){
        return this.cogsResult$.getValue();
    }

    // get calculation history
    getCalculationHistory(){
        return this.calculationHistory$.getValue();
    }

    // clear current result
    clearCogsResult(){
        this.cogsResult$.next(null);
        console.log('[REACTIVE] COGS result cleared');
    }

    // clear history
    clearHistory(){
        this.calculationHistory$.next([]);
        console.log('[REACTIVE] Calculation history cleared');
    }

    // reset all data
    resetAll(){
        this.productCategories$.next([]);
        this.productVariables$.next([]);
        this.productFixedCosts$.next([]);
        this.cogsResult$.next(null);
        this.calculationHistory$.next([]);
        console.log('[REACTIVE] All COGS calculator data reset');
    }
}

export default new CogsCalculatorService();
