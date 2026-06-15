<template>
  <section class="mb-10">
    <div v-if="configs.general_show_facebook !== false" class="mb-12">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
        <div class="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 uppercase">Archivos de Facebook</h2>
      </div>

      <p class="text-gray-500 my-2">Actualiza los archivos CSV arrastrándolos a su categoría correspondiente.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="file in facebookFiles" :key="file.id" class="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">{{ file.icon }}</span>
            <h3 class="text-lg font-bold text-pluxeeBlue">{{ file.title }}</h3>
          </div>

          <div
            class="relative flex items-center justify-center w-full"
            @dragover.prevent="dragState[file.id] = true"
            @dragenter.prevent="dragState[file.id] = true"
            @dragleave.prevent="dragState[file.id] = false"
            @drop.prevent="onDrop(file.id, $event)">
            <label
              :for="'dropzone-' + file.id"
              :class="[
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
                dragState[file.id] ? 'bg-blue-50 border-[#1877F2] scale-[1.02]' : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-[#1877F2]',
              ]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg :class="dragState[file.id] ? 'text-[#1877F2]' : 'text-gray-400'" class="w-8 h-8 mb-2 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 text-center">
                  <span class="font-semibold text-[#1877F2]">Arrastra tu archivo aquí</span>
                  <br />
                  o haz clic para explorar
                </p>
              </div>
              <input :id="'dropzone-' + file.id" type="file" class="hidden" accept=".csv" @change="onFileSelect(file.id, $event)" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="configs.general_show_instagram !== false" class="mb-12">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
        <div class="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full flex items-center justify-center text-white shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 uppercase">Archivos de Instagram</h2>
      </div>
      <p class="text-gray-500 my-2">Actualiza los archivos CSV arrastrándolos a su categoría correspondiente.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="file in instagramFiles" :key="file.id" class="bg-white p-6 rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">{{ file.icon }}</span>
            <h3 class="text-lg font-bold text-pluxeeBlue">{{ file.title }}</h3>
          </div>

          <div
            class="relative flex items-center justify-center w-full"
            @dragover.prevent="dragState[file.id] = true"
            @dragenter.prevent="dragState[file.id] = true"
            @dragleave.prevent="dragState[file.id] = false"
            @drop.prevent="onDrop(file.id, $event)">
            <label
              :for="'dropzone-' + file.id"
              :class="[
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
                dragState[file.id] ? 'bg-pink-50 border-[#e1306c] scale-[1.02]' : 'bg-gray-50 border-gray-300 hover:bg-pink-50 hover:border-[#e1306c]',
              ]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg :class="dragState[file.id] ? 'text-[#e1306c]' : 'text-gray-400'" class="w-8 h-8 mb-2 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 text-center">
                  <span class="font-semibold text-[#e1306c]">Arrastra tu archivo aquí</span>
                  <br />
                  o haz clic para explorar
                </p>
              </div>
              <input :id="'dropzone-' + file.id" type="file" class="hidden" accept=".csv" @change="onFileSelect(file.id, $event)" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="configs.general_show_linkedin !== false" class="mb-12">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
        <div class="w-10 h-10 bg-[#0e76a8] rounded-full flex items-center justify-center text-white shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 uppercase">Archivos de LinkedIn</h2>
      </div>

      <p class="text-gray-500 my-2">Actualiza los archivos CSV arrastrándolos a su categoría correspondiente.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="file in linkedinFiles" :key="file.id" class="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">{{ file.icon }}</span>
            <h3 class="text-lg font-bold text-pluxeeBlue">{{ file.title }}</h3>
          </div>

          <div
            class="relative flex items-center justify-center w-full"
            @dragover.prevent="dragState[file.id] = true"
            @dragenter.prevent="dragState[file.id] = true"
            @dragleave.prevent="dragState[file.id] = false"
            @drop.prevent="onDrop(file.id, $event)">
            <label
              :for="'dropzone-' + file.id"
              :class="[
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
                dragState[file.id] ? 'bg-blue-50 border-[#0e76a8] scale-[1.02]' : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-[#0e76a8]',
              ]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg :class="dragState[file.id] ? 'text-[#0e76a8]' : 'text-gray-400'" class="w-8 h-8 mb-2 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 text-center">
                  <span class="font-semibold text-[#0e76a8]">Arrastra tu archivo aquí</span>
                  <br />
                  o haz clic para explorar
                </p>
              </div>
              <input :id="'dropzone-' + file.id" type="file" class="hidden" accept=".csv" @change="onFileSelect(file.id, $event)" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="configs.general_show_tiktok !== false" class="mb-12">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
        <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 uppercase">Archivos de TikTok</h2>
      </div>

      <p class="text-gray-500 my-2">Actualiza los archivos CSV arrastrándolos a su categoría correspondiente.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="file in tiktokFiles" :key="file.id" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">{{ file.icon }}</span>
            <h3 class="text-lg font-bold text-pluxeeBlue">{{ file.title }}</h3>
          </div>

          <div
            class="relative flex items-center justify-center w-full"
            @dragover.prevent="dragState[file.id] = true"
            @dragenter.prevent="dragState[file.id] = true"
            @dragleave.prevent="dragState[file.id] = false"
            @drop.prevent="onDrop(file.id, $event)">
            <label
              :for="'dropzone-' + file.id"
              :class="[
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
                dragState[file.id] ? 'bg-gray-100 border-black scale-[1.02]' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-black',
              ]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg :class="dragState[file.id] ? 'text-black' : 'text-gray-400'" class="w-8 h-8 mb-2 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 text-center">
                  <span class="font-semibold text-black">Arrastra tu archivo aquí</span>
                  <br />
                  o haz clic para explorar
                </p>
              </div>
              <input :id="'dropzone-' + file.id" type="file" class="hidden" accept=".csv" @change="onFileSelect(file.id, $event)" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="configs.general_show_x !== false" class="mb-12">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
        <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 uppercase">Archivos de X (Twitter)</h2>
      </div>

      <p class="text-gray-500 my-2">Actualiza los archivos CSV arrastrándolos a su categoría correspondiente.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="file in xFiles" :key="file.id" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">{{ file.icon }}</span>
            <h3 class="text-lg font-bold text-pluxeeBlue">{{ file.title }}</h3>
          </div>

          <div
            class="relative flex items-center justify-center w-full"
            @dragover.prevent="dragState[file.id] = true"
            @dragenter.prevent="dragState[file.id] = true"
            @dragleave.prevent="dragState[file.id] = false"
            @drop.prevent="onDrop(file.id, $event)">
            <label
              :for="'dropzone-' + file.id"
              :class="[
                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
                dragState[file.id] ? 'bg-gray-100 border-gray-800 scale-[1.02]' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-800',
              ]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg :class="dragState[file.id] ? 'text-gray-800' : 'text-gray-400'" class="w-8 h-8 mb-2 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 text-center">
                  <span class="font-semibold text-gray-800">Arrastra tu archivo aquí</span>
                  <br />
                  o haz clic para explorar
                </p>
              </div>
              <input :id="'dropzone-' + file.id" type="file" class="hidden" accept=".csv" @change="onFileSelect(file.id, $event)" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useToast } from '@/composables/useToast'
  import { usePeriod } from '@/composables/usePeriod'
  import { useApi } from '@/composables/useApi'

  const { showToast } = useToast()
  const { selectedPeriod } = usePeriod()
  const { apiRequest } = useApi()

  const configs = ref({})
  const dragState = ref({})

  // 🚀 ACTUALIZADO: Agregamos las nuevas categorías al arreglo central
  const fileCategories = [
    { id: 'fb_overview', title: 'Facebook: Overview KPIs', icon: '📘' },
    { id: 'fb_posts', title: 'Facebook: Métricas de Posts', icon: '📝' },
    { id: 'fb_sentiment', title: 'Facebook: Sentimientos', icon: '❤️' },
    { id: 'ig_overview', title: 'Instagram: Overview KPIs', icon: '📸' },
    { id: 'ig_posts', title: 'Instagram: Métricas de Posts', icon: '📱' },
    { id: 'ig_sentiment', title: 'Instagram: Sentimientos', icon: '❤️' },
    { id: 'li_overview', title: 'LinkedIn: Overview KPIs', icon: '💼' },
    { id: 'li_posts', title: 'LinkedIn: Métricas de Posts', icon: '📝' },
    { id: 'tk_overview', title: 'TikTok: Overview KPIs', icon: '🎵' },
    { id: 'tk_posts', title: 'TikTok: Métricas de Posts', icon: '📱' },
    { id: 'x_overview', title: 'X (Twitter): Overview KPIs', icon: '🐦' },
    { id: 'x_posts', title: 'X (Twitter): Métricas de Posts', icon: '📝' },
  ]

  const facebookFiles = computed(() => {
    return fileCategories.filter(file => file.id.includes('fb') || file.id.includes('facebook'))
  })

  const instagramFiles = computed(() => {
    return fileCategories.filter(file => file.id.includes('ig') || file.id.includes('instagram'))
  })

  const linkedinFiles = computed(() => {
    return fileCategories.filter(file => file.id.includes('li') || file.id.includes('linkedin'))
  })

  const tiktokFiles = computed(() => {
    return fileCategories.filter(file => file.id.includes('tk') || file.id.includes('tiktok'))
  })

  const xFiles = computed(() => {
    return fileCategories.filter(file => file.id.startsWith('x_'))
  })

  // LÓGICA CENTRALIZADA DE SUBIDA
  const processFile = async (typeId, file) => {
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showToast('Error: Solo se permiten archivos .csv', 'error')
      return
    }

    const formData = new FormData()
    formData.append('csvFile', file)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${apiUrl}/api/upload/${typeId}/${selectedPeriod.value}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Error al subir el archivo al servidor')

      showToast(`¡Éxito! Archivo actualizado para ${selectedPeriod.value}.`, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  // Evento 1: Cuando el usuario hace CLIC en la caja y elige el archivo
  const onFileSelect = (typeId, event) => {
    const file = event.target.files[0]
    processFile(typeId, file)
    event.target.value = '' // Reseteamos el input
  }

  // Evento 2: Cuando el usuario ARRASTRA Y SUELTA el archivo
  const onDrop = (typeId, event) => {
    dragState.value[typeId] = false
    const file = event.dataTransfer.files[0]
    processFile(typeId, file)
  }

  // Función para pedirle a la base de datos qué está oculto (Rompiendo caché)
  const fetchConfigs = async () => {
    if (!selectedPeriod.value) return
    try {
      const data = await apiRequest(`/api/report-config?periodo=${selectedPeriod.value}&t=${Date.now()}`)
      configs.value = data || {}
    } catch (error) {
      console.error('Error cargando configuraciones en el uploader:', error)
    }
  }

  // Escuchador inter-pestañas
  const escucharConfigCambios = event => {
    if (event.key === 'reporte_config_actualizada') fetchConfigs()
  }

  // Reactividad: Si cambiamos de mes, actualiza las cajitas permitidas
  watch(selectedPeriod, () => {
    fetchConfigs()
  })

  // Arrancamos los motores al cargar la página
  onMounted(() => {
    fetchConfigs()
    window.addEventListener('storage', escucharConfigCambios)
    window.addEventListener('config_actualizada_local', fetchConfigs)
  })

  // Limpiamos la memoria
  onUnmounted(() => {
    window.removeEventListener('storage', escucharConfigCambios)
    window.removeEventListener('config_actualizada_local', fetchConfigs)
  })
</script>
