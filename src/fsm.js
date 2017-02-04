class FSM {

    constructor(config) {
        this.stat = null;
        this.new_trigger = null;
        this.pred = null;
        this.new_redo = null;
        this.count_undo = 0;
        this.count_redo = 0;
        if(typeof(config)=="undefined"){
           throw e;
        }else if(typeof(config)=="object"){
            this.stat = config.initial;
        }        
    }    

    getState() {
        return this.stat;
    }

    changeState(state) {
        this.count_undo = 0;
        if((state=="normal")||(state=="hungry")||(state=="busy")||(state=="sleeping")){
            this.stat = state;
        }else{
             throw e;
        }
    }

    trigger(event) {
        this.count_undo = 0;
        if((event=="study")&&(this.stat=="normal")){
            this.stat = "busy";            
            this.new_trigger = "study";
            this.new_redo = "busy";
        }else if((event=="get_tired")&&(this.stat=="busy")){
            this.stat = "sleeping";            
            this.new_trigger = "get_tired";
            this.new_redo = "sleeping";
        }else if((event=="get_hungry")&&(this.stat=="busy")){
            this.stat = "hungry";
            this.new_trigger = "get_hungry";
            this.pred = "busy";
            this.new_redo = "hungry";
        }else if((event=="get_hungry")&&(this.stat=="sleeping")){
            this.stat = "hungry";
            this.new_trigger = "get_hungry";
            this.pred = "sleeping";
            this.new_redo = "hungry";
        }else if((event=="get_up")&&(this.stat=="sleeping")){
            this.stat = "normal";
            this.new_trigger = "get_up";
        }else if((event=="eat")&&(this.stat=="hungry")){
            this.stat = "normal";
            this.new_trigger = "eat";
        }else{
            throw e;
        }
    }

    reset() {
        this.stat = "normal";
    }

    getStates(event) {
        this.arr_event_all = ['normal', 'busy', 'hungry', 'sleeping'];
        this.arr_evant_get_hungry = ['busy', 'sleeping'];
        this.arr_event_study = ['normal'];
        this.arr_event_eat = ['hungry'];
        this.arr_event_get_up = ['sleeping'];
        this.arr_event_get_tired = ['busy'];
        this.arr_event_null = [];


        if(typeof(event)=="undefined"){
            return this.arr_event_all;
        }else if(event=="get_hungry"){
            return this.arr_evant_get_hungry;
        }else if(event=="eat"){
            return this.arr_event_eat;
        }else if(event=="get_up"){
            return this.arr_event_get_up;
        }else if(event=="study"){
            return this.arr_event_study;
        }else if(event=="get_tired"){
            return this.arr_event_get_tired;
        }else {
            return this.arr_event_null;
        }       
    }

    undo() {
        this.count_undo++;
        if((this.stat=="busy")&&(this.new_trigger = "study")){
            this.stat="normal";
            this.new_redo = "busy";
            return true;
        }else if((this.stat=="sleeping")&&(this.new_trigger = "get_tired")){
            this.stat="busy";
            this.new_trigger = "study";
            this.new_redo = "sleeping";
            return true;
        }else if((this.stat=="hungry")&&(this.new_trigger=="get_hungry")&&(this.pred=="sleeping")){
            this.stat="sleeping";
            this.new_trigger = "get_tired";
            this.new_redo = "hungry";
            return true;
        }else if((this.stat=="hungry")&&(this.new_trigger=="get_hungry")&&(this.pred=="busy")){
            this.stat="busy";
            this.new_trigger = "study";
            this.new_redo = "hungry";
            return true;
        }else if(((this.stat=="hungry")&&(this.pred==null))||((this.stat=="sleeping")&&(this.pred==null))){
            this.stat="normal";
            this.new_trigger = null;
            return true;
        }else if((this.stat=="normal")&&(this.new_trigge==null)){
            return false;
        }                   
    }

    redo() {
        this.count_redo++;
        if((this.stat=="normal")&&(this.new_redo=="busy")){
            this.stat="busy";
            return true;
        }else if((this.stat=="busy")&&(this.new_trigger=="study")&&(this.new_redo=="sleeping")){
            this.stat="sleeping";
            this.new_trigger="get_tired";
            this.new_redo = "hungry";
            return true;            
        }else if((this.stat=="sleeping")&&(this.new_trigger=="get_tired")&&(this.new_redo=="hungry")){
            this.stat="hungry";
            this.new_trigger="get_hungry";
            this.new_redo = "normal";
            return true; 
        }else if((this.stat=="hungry")&&(this.new_trigger=="get_hungry")&&(this.new_redo=="normal")){
            this.stat="normal";
            this.new_trigger="eat";
            this.new_redo = "busy";
            return true; 
        }else if((this.stat=="busy")&&(this.new_trigger=="get_hungry")&&(this.new_redo=="hungry")){
            this.stat="hungry";
            this.new_trigger="eat";
            this.new_redo = "normal";
            return true; 
        }
        if(this.stat=="normal"){
            return false;
        }
        if(this.count_redo>this.count_undo){
            return false;
        }
    }

    clearHistory() {
        this.stat = "normal";
        this.new_trigge = null;

    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
