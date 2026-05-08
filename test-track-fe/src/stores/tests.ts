import { defineStore } from 'pinia';

export const useTestStore = defineStore('test', {
    state: () => ({
        message: 'Hello from the test store!'
    }),
    actions: {
        updateMessage(newMessage: string) {
            this.message = newMessage;
        }
    }
});
