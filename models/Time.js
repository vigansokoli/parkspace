class Time{
    
    constructor(hours, minutes){
        this.hours = hours;
        this.minutes = minutes;
    }

    toString(){
        return this.hours + ":" + this.minutes;

    }

    getHours(){
        return this.hours;
    }

    getMinutes(){
        return this.minutes;
    }
}