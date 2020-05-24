export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
            const randomValue = Math.ceil((Math.random() * 16));
            const value = character === 'x' ? randomValue : (randomValue % 4 + 8);
            return value.toString(16);
        });
    }
}