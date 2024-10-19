import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserDataStore = defineStore('user', () => {
  const email = ref('');
  const setEmail = (newEmail: string) => {
      email.value = newEmail;
  };  

  return { email, setEmail };
});