export class Duration {
    minutes: number = 0;

    constructor(minutes: number) {
        this.minutes = minutes;
    }

    getHours(): number {
        return Math.floor(this.minutes / 60);          
    }

    getMinutes(): number {
        return this.minutes % 60;
    }

    getTime(): number {
        return  this.minutes * 60 * 1000;
    }

    isSetted(): boolean {
        return this.minutes !== 0
    }
}