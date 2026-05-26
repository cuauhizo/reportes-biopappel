import { ref, watch } from 'vue'

// Definimos la variable FUERA de la función para que sea global (Singleton)
const redSeleccionada = ref(localStorage.getItem('adminUltimaRed') || 'fb')

// Vigilamos los cambios para guardarlos en la memoria del navegador
watch(redSeleccionada, nuevaRed => {
  localStorage.setItem('adminUltimaRed', nuevaRed)
})

export function useSocialNetwork() {
  return { redSeleccionada }
}
