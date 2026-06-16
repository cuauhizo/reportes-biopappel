<template>
  <section class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-10 overflow-hidden">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-black text-gray-800 uppercase flex items-center">
        <SquarePen class="w-7 h-7 mr-3 text-gray-800" stroke-width="2.5" />
        Edición Manual de Posts
      </h2>
      <div class="flex gap-2 mt-4 md:mt-0 bg-gray-100 p-1 rounded-lg">
        <button
          v-if="configs.general_show_facebook !== false"
          @click="redSeleccionada = 'fb'"
          :class="redSeleccionada === 'fb' ? 'bg-[#1877F2] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-1.5 rounded-md font-bold text-sm transition-colors">
          Facebook
        </button>

        <button
          v-if="configs.general_show_instagram !== false"
          @click="redSeleccionada = 'ig'"
          :class="redSeleccionada === 'ig' ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-1.5 rounded-md font-bold text-sm transition-colors">
          Instagram
        </button>

        <button
          v-if="configs.general_show_linkedin !== false"
          @click="redSeleccionada = 'li'"
          :class="redSeleccionada === 'li' ? 'bg-[#0e76a8]  text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-1.5 rounded-md font-bold text-sm transition-colors">
          LinkedIn
        </button>

        <button
          v-if="configs.general_show_tiktok !== false"
          @click="redSeleccionada = 'tk'"
          :class="redSeleccionada === 'tk' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-1.5 rounded-md font-bold text-sm transition-colors">
          TikTok
        </button>

        <button
          v-if="configs.general_show_x !== false"
          @click="redSeleccionada = 'x'"
          :class="redSeleccionada === 'x' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-1.5 rounded-md font-bold text-sm transition-colors">
          X
        </button>
      </div>
    </div>
    <!-- <pre>{{ posts.slice(0, 1) }}</pre> -->
    <div v-if="posts.length === 0" class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-gray-500 font-medium">
        No se encontraron posts de {{ redSeleccionada.toUpperCase() }} para el periodo
        <b>{{ selectedPeriod }}</b>
        .
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm border-collapse min-w-[1000px]">
        <!-- <thead>
          <tr class="text-gray-400 text-[10px] uppercase tracking-widest border-b-2 border-gray-100">
            <th class="pb-2 w-64">Post Original</th>
            <th class="pb-2 w-40">Etiquetas (Tags)</th>
            <th class="pb-2 w-20 text-center">Vistas</th>
            <th class="pb-2 w-20 text-center">Alcance</th>
            <th class="pb-2 w-20 text-center">Interacc.</th>
            <th class="pb-2 w-20 text-center">Shares</th>
            <th v-if="redSeleccionada === 'ig' || redSeleccionada === 'fb'" class="pb-2 w-20 text-center">Saves</th>
            <th v-else class="pb-2 w-20 text-center">Comentarios</th>
            <th class="text-black pb-2 text-center w-16">Acción</th>
          </tr>
        </thead> -->
        <thead>
          <tr class="text-gray-400 text-[10px] uppercase tracking-widest border-b-2 border-gray-100">
            <th class="pb-2 w-64">Post Original</th>
            <th class="pb-2 w-40">Etiquetas (Tags)</th>
            <!-- Vistas / Impresiones -->
            <th class="pb-2 w-20 text-center">
              {{ redSeleccionada === 'x' || redSeleccionada === 'li' ? 'Impresiones' : 'Vistas' }}
            </th>
            <!-- Alcance -->
            <th class="pb-2 w-20 text-center">Alcance</th>
            <!-- Interacciones / Likes -->
            <th class="pb-2 w-20 text-center">
              {{ redSeleccionada === 'tk' || redSeleccionada === 'x' ? 'Likes' : 'Interacc.' }}
            </th>
            <!-- Shares / Reposts -->
            <th class="pb-2 w-20 text-center">
              {{ redSeleccionada === 'x' ? 'Reposts' : 'Shares' }}
            </th>
            <!-- Saves / Comentarios / Replies -->
            <th class="pb-2 w-20 text-center">
              {{ redSeleccionada === 'ig' || redSeleccionada === 'fb' ? 'Saves' : redSeleccionada === 'x' ? 'Replies' : 'Comentarios' }}
            </th>
            <th class="text-black pb-2 text-center w-16">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors group">
            <td class="py-3 pr-4 align-top w-64">
              <div class="flex gap-3 items-start">
                <img :src="post.img" class="w-14 h-14 object-cover rounded-md shadow-sm shrink-0 bg-gray-200 border border-gray-300" />

                <div class="flex-1 min-w-0">
                  <p class="text-[11px] text-gray-500 line-clamp-2 italic mb-1.5 leading-tight" :title="post.mensaje">"{{ post.mensaje || 'Sin texto' }}"</p>
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{{ post.tipo_post }}</span>
                    <a :href="post.permalink" target="_blank" class="text-[10px] text-blue-500 hover:underline font-bold flex items-center gap-1">
                      Ver Original
                      <ExternalLink class="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </td>

            <td class="py-3 px-1 align-top">
              <input v-model="post.tags" type="text" placeholder="#Tolko, #Trend..." class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-xs font-bold text-blue-700 bg-blue-50" />
            </td>
            <td class="py-3 px-1 align-top">
              <input v-if="redSeleccionada === 'li'" v-model="post.impresiones" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else-if="redSeleccionada === 'x'" v-model="post.impressions" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else-if="redSeleccionada === 'tk'" v-model="post.video_views" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else v-model="post.visitas" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
            </td>
            <td class="py-3 px-1 align-top">
              <input v-if="redSeleccionada === 'tk'" v-model="post.reach" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else v-model="post.alcance" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
            </td>
            <td class="py-3 px-1 align-top">
              <input v-if="redSeleccionada === 'tk' || redSeleccionada === 'x'" v-model="post.likes" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else v-model="post.interacciones" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
            </td>
            <!-- <td class=" py-3 px-1 align-top"><input v-model="post.likes" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" /></td> -->
            <td class="py-3 px-1 align-top">
              <input v-if="redSeleccionada === 'x'" v-model="post.reposts" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else v-model="post.shares" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
            </td>
            <td class="py-3 px-1 align-top">
              <input v-if="redSeleccionada === 'li'" v-model="post.comentarios" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else-if="redSeleccionada === 'tk'" v-model="post.comments" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else-if="redSeleccionada === 'x'" v-model="post.replies" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
              <input v-else-if="redSeleccionada === 'ig'" v-model="post.saves" type="number" class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-gray-700" />
            </td>

            <td class="py-3 text-center align-top">
              <button @click="guardarPost(post)" :disabled="isSaving" class="bg-gray-800 text-white p-2 rounded-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50" title="Guardar cambios"><Save class="w-5 h-5" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useApi } from '@/composables/useApi'
  import { usePeriod } from '@/composables/usePeriod'
  import { useToast } from '@/composables/useToast'
  import { SquarePen, Save, ExternalLink } from 'lucide-vue-next'
  import { useSocialNetwork } from '@/composables/useSocialNetwork'

  const { apiRequest, isSaving, apiUrl } = useApi()
  const { selectedPeriod } = usePeriod()
  const { showToast } = useToast()
  const configs = ref({})

  const { redSeleccionada } = useSocialNetwork()
  const posts = ref([])

  // Función para cargar las configuraciones del periodo
  const fetchConfigs = async () => {
    if (!selectedPeriod.value) return
    try {
      const data = await apiRequest(`/api/report-config?periodo=${selectedPeriod.value}`)
      configs.value = data || {}

      // Inteligencia: Si la red en la que estoy parado se ocultó, me muevo a una visible
      if (redSeleccionada.value === 'fb' && data.general_show_facebook === false) {
        saltarARedVisible()
      } else if (redSeleccionada.value === 'ig' && data.general_show_instagram === false) {
        saltarARedVisible()
      } else if (redSeleccionada.value === 'li' && data.general_show_linkedin === false) {
        saltarARedVisible()
      }
    } catch (error) {
      console.error('Error cargando configuraciones en admin:', error)
    }
  }

  const saltarARedVisible = () => {
    if (configs.value.general_show_facebook !== false) redSeleccionada.value = 'fb'
    else if (configs.value.general_show_instagram !== false) redSeleccionada.value = 'ig'
    else if (configs.value.general_show_linkedin !== false) redSeleccionada.value = 'li'
    else if (configs.value.general_show_tiktok !== false) redSeleccionada.value = 'tk'
    else if (configs.value.general_show_x !== false) redSeleccionada.value = 'x'
  }

  // Cargar posts
  const fetchPosts = async () => {
    posts.value = []
    try {
      // Cargamos los posts Y las imágenes subidas al mismo tiempo
      const [postsData, imagesData] = await Promise.all([apiRequest(`/api/posts?periodo=${selectedPeriod.value}&red_social=${redSeleccionada.value}`), apiRequest(`/api/post-images`, { cache: 'no-store' })])

      // Convertimos las imágenes en un diccionario rápido { id: url }
      const dictImages = {}
      imagesData.forEach(img => (dictImages[img.post_id] = img.image_url))

      // Asignamos la imagen a cada post
      posts.value = postsData.map(p => {
        // let defaultImg =
        //   redSeleccionada.value === 'fb' ? 'https://placehold.co/150x150/1877F2/ffffff?text=FB' : redSeleccionada.value === 'li' ? 'https://placehold.co/150x150/0a66c2/ffffff?text=LI' : 'https://placehold.co/150x150/e1306c/ffffff?text=IG'
        let defaultImg
        if (redSeleccionada.value === 'fb') defaultImg = 'https://placehold.co/150x150/1877F2/ffffff?text=FB'
        else if (redSeleccionada.value === 'li') defaultImg = 'https://placehold.co/150x150/0a66c2/ffffff?text=LI'
        else if (redSeleccionada.value === 'ig') defaultImg = 'https://placehold.co/150x150/e1306c/ffffff?text=IG'
        else if (redSeleccionada.value === 'tk') defaultImg = 'https://placehold.co/150x150/000000/ffffff?text=TikTok'
        else if (redSeleccionada.value === 'x') defaultImg = 'https://placehold.co/150x150/1f2937/ffffff?text=X'
        else defaultImg = 'https://placehold.co/150x150/cccccc/ffffff?text=Post'

        if (p.tipo_post && p.tipo_post.toUpperCase().includes('STORY')) {
          defaultImg = 'https://placehold.co/150x150/fcb045/ffffff?text=Story'
        }

        return {
          ...p,
          // Si hay imagen tuya, la usamos. Si no, usamos el placeholder con el color de la red social
          img: dictImages[p.id] ? `${apiUrl}${dictImages[p.id]}?t=${Date.now()}` : defaultImg,
        }
      })
    } catch (error) {
      console.error('Error cargando posts:', error)
    }
  }

  const escucharConfigCambios = event => {
    if (event.key === 'reporte_config_actualizada') {
      fetchConfigs()
    }
  }

  // Guardar un post individual
  const guardarPost = async post => {
    try {
      await apiRequest(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...post,
          red_social: redSeleccionada.value,
        }),
      })
      showToast('Post actualizado exitosamente', 'success')
    } catch (error) {
      showToast('Error al actualizar el post', 'error')
    }
  }

  // Reactividad a cambios de Red Social o Periodo
  watch(selectedPeriod, () => {
    fetchPosts()
    fetchConfigs()
  })

  watch(redSeleccionada, () => {
    fetchPosts()
  })

  onMounted(() => {
    fetchPosts()
    fetchConfigs()
    window.addEventListener('storage', escucharConfigCambios) // Para otras pestañas
    window.addEventListener('config_actualizada_local', fetchConfigs)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', escucharConfigCambios)

    // Limpiamos la memoria
    window.removeEventListener('config_actualizada_local', fetchConfigs)
  })
</script>
