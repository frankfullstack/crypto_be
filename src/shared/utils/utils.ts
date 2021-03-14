export class Utils {
    static generateRandomString(length: number) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length).toUpperCase();
    }

    static generateRandomNumber(min, max, decimalPlaces) {
        return (Math.random() * (max - min) + min).toFixed(decimalPlaces) * 1;
    }

    static getRandomArrayItem(array: any[]) {
       return Math.floor(Math.random() * array.length);
    }
}