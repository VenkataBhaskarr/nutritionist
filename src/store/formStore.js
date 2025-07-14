// store/formStore.js
import {create} from 'zustand'

const useFormStore = create((set) => ({
  form: {
    name: "",
    illness: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    language: "",
    acceptedTnC: false
  },
  setFormField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value }
    })),
  resetForm: () =>
    set({
      form: {
        name: "",
        illness: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        language: "",
        acceptedTnC: false
      }
    })
}))
export default useFormStore;
