<template>
  <section class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-10">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-black text-gray-800 uppercase flex items-center">
        <ScanSearch class="w-7 h-7 mr-3 text-gray-800" stroke-width="2.5" />
        Auditoría de Métricas Globales
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

    <div v-if="!datosCargados" class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-gray-500 font-medium">
        No se encontraron datos de {{ redSeleccionada.toUpperCase() }} para el periodo
        <b>{{ selectedPeriod }}</b>
        .
      </p>
      <p class="text-sm text-gray-400 mt-2">Sube primero el CSV de "Overview" para poder editar sus métricas.</p>
    </div>

    <div v-else-if="redSeleccionada === 'fb'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
        <label class="text-[10px] font-bold text-blue-800 uppercase block mb-1">Total Followers</label>
        <input v-model="formData.total_followers" type="number" class="w-full bg-white border border-blue-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
        <label class="text-[10px] font-bold text-blue-800 uppercase block mb-1">Nuevos Followers</label>
        <input v-model="formData.new_followers" type="number" class="w-full bg-white border border-blue-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
        <label class="text-[10px] font-bold text-blue-800 uppercase block mb-1">Engagement Rate (%)</label>
        <input v-model="formData.engagement_rate" type="number" step="0.01" class="w-full bg-white border border-blue-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
        <label class="text-[10px] font-bold text-blue-800 uppercase block mb-1">Interacciones</label>
        <input v-model="formData.fb_interactions" type="number" class="w-full bg-white border border-blue-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Clics (Link)</label>
        <input v-model="formData.fb_clics" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Shares</label>
        <input v-model="formData.fb_shares" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Comments (Responding)</label>
        <input v-model="formData.fb_comments" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Impresiones</label>
        <input v-model="formData.fb_post_impressions" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Alcance Orgánico</label>
        <input v-model="formData.fb_page_organic_reach" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Vistas: No Seguidores</label>
        <input v-model="formData.fb_page_no_followers_views" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Vistas: Seguidores</label>
        <input v-model="formData.fb_page_followers_views" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tiempo de Respuesta</label>
        <input v-model="formData.fb_time_visualization" type="text" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 font-bold text-gray-700" />
      </div>
    </div>

    <div v-else-if="redSeleccionada === 'ig'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-pink-50 p-3 rounded-xl border border-pink-100">
        <label class="text-[10px] font-bold text-pink-800 uppercase block mb-1">Total Followers</label>
        <input v-model="formData.total_followers" type="number" class="w-full bg-white border border-pink-200 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-pink-50 p-3 rounded-xl border border-pink-100">
        <label class="text-[10px] font-bold text-pink-800 uppercase block mb-1">Engagement Rate (%)</label>
        <input v-model="formData.engagement_rate" type="number" step="0.01" class="w-full bg-white border border-pink-200 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-pink-50 p-3 rounded-xl border border-pink-100">
        <label class="text-[10px] font-bold text-pink-800 uppercase block mb-1">Post Saves</label>
        <input v-model="formData.ig_post_saves" type="number" class="w-full bg-white border border-pink-200 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-pink-50 p-3 rounded-xl border border-pink-100">
        <label class="text-[10px] font-bold text-pink-800 uppercase block mb-1">Post Likes</label>
        <input v-model="formData.ig_post_likes" type="number" class="w-full bg-white border border-pink-200 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Impressions</label>
        <input v-model="formData.ig_post_impressions" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Story: Taps Forward</label>
        <input v-model="formData.ig_story_taps_forward" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Story: Taps Back</label>
        <input v-model="formData.ig_story_taps_back" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Story: Exits</label>
        <input v-model="formData.ig_story_exits" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">News Followers</label>
        <input v-model="formData.new_followers" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>

      <div class="col-span-2 md:col-span-4 mt-2">
        <h4 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-1 mb-3">Alcances Máximos</h4>
      </div>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reach: Carousel</label>
        <input v-model="formData.ig_reach_carousel" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reach: Photo</label>
        <input v-model="formData.ig_reach_photo" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reach: Reel</label>
        <input v-model="formData.ig_reach_reel" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reach: Story</label>
        <input v-model="formData.ig_reach_story" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-pink-500 font-bold text-gray-700" />
      </div>
    </div>

    <div v-else-if="redSeleccionada === 'li'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-sky-50 p-3 rounded-xl border border-sky-100">
        <label class="text-[10px] font-bold text-sky-800 uppercase block mb-1">Total Followers</label>
        <input v-model="formData.total_followers" type="number" class="w-full bg-white border border-sky-200 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-sky-50 p-3 rounded-xl border border-sky-100">
        <label class="text-[10px] font-bold text-sky-800 uppercase block mb-1">Nuevos Followers</label>
        <input v-model="formData.new_followers" type="number" class="w-full bg-white border border-sky-200 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-sky-50 p-3 rounded-xl border border-sky-100">
        <label class="text-[10px] font-bold text-sky-800 uppercase block mb-1">Eng. Rate Página (%)</label>
        <input v-model="formData.li_page_engagements_rate" type="number" step="0.01" class="w-full bg-white border border-sky-200 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-sky-50 p-3 rounded-xl border border-sky-100">
        <label class="text-[10px] font-bold text-sky-800 uppercase block mb-1">Eng. Rate Posts (%)</label>
        <input v-model="formData.engagement_rate" type="number" step="0.01" class="w-full bg-white border border-sky-200 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>

      <div class="col-span-2 md:col-span-4 mt-2">
        <h4 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-1 mb-3">Métricas de la Página</h4>
      </div>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Alcance (Reach)</label>
        <input v-model="formData.li_page_reach" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Interacciones</label>
        <input v-model="formData.li_page_engagement" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Clics</label>
        <input v-model="formData.li_page_clicks" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Comentarios</label>
        <input v-model="formData.li_page_comments" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Compartidos (Shares)</label>
        <input v-model="formData.li_page_shares" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>

      <div class="col-span-2 md:col-span-4 mt-2">
        <h4 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-1 mb-3">Métricas de Publicaciones</h4>
      </div>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Total de Posts</label>
        <input v-model="formData.li_posts" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Alcance (Reach)</label>
        <input v-model="formData.li_post_reach" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reacciones</label>
        <input v-model="formData.li_post_reactions" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Comentarios</label>
        <input v-model="formData.li_post_comments" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
      <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Views de Video</label>
        <input v-model="formData.li_post_video_viewers" type="number" class="w-full bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#0e76a8] font-bold text-gray-700" />
      </div>
    </div>

    <div v-else-if="redSeleccionada === 'tk'" class="grid grid-cols-2 md:grid-cols-4 gap-4">contenido TK</div>

    <div v-else-if="redSeleccionada === 'x'" class="grid grid-cols-2 md:grid-cols-4 gap-4">contenido X</div>

    <div v-if="datosCargados" class="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div @click="desgloseAbierto = !desgloseAbierto" class="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors">
        <h3 class="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center">Desglose Diario (Seguidores y Posts)</h3>
        <ChevronDown :class="{ 'rotate-180': desgloseAbierto }" class="w-5 h-5 text-gray-500 transition-transform duration-300" />
      </div>

      <div v-show="desgloseAbierto">
        <div v-if="historicalData.length === 0" class="p-6 text-center text-sm text-gray-500 italic">No hay datos históricos registrados para este mes.</div>

        <div v-else class="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 sticky top-0 shadow-sm">
              <tr>
                <th class="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-200">Fecha</th>
                <th class="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-200">Seguidores</th>
                <th class="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-200">Posts Publicados</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="item in historicalData" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-2 font-bold text-gray-600">
                  {{ formatDate(item.fecha ? item.fecha.split('T')[0] : '') }}
                </td>

                <td class="px-6 py-2">
                  <input v-model="item.followers" type="number" class="w-24 border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition-colors" />
                </td>
                <td class="px-6 py-2">
                  <input v-model="item.published_posts" type="number" class="w-24 border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition-colors" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="datosCargados" class="mt-6 flex justify-end">
      <button @click="guardarCambios" :disabled="isSaving" class="bg-gray-800 text-white px-8 py-2 rounded-xl font-bold hover:scale-105 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
        <Save class="w-5 h-5" />
        <span v-if="isSaving">Guardando...</span>
        <span v-else>Guardar Auditoría</span>
      </button>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useApi } from '@/composables/useApi'
  import { usePeriod } from '@/composables/usePeriod'
  import { useToast } from '@/composables/useToast'
  import { ScanSearch, Save, ChevronDown } from 'lucide-vue-next'
  import { formatDate } from '@/utils/formatters'
  import { useSocialNetwork } from '@/composables/useSocialNetwork'

  const { apiRequest, isSaving } = useApi()
  const { selectedPeriod } = usePeriod()
  const { showToast } = useToast()

  const { redSeleccionada } = useSocialNetwork()
  const datosCargados = ref(false)
  const formData = ref({})
  const historicalData = ref([])
  const desgloseAbierto = ref(false)
  const configs = ref({})

  // 2. Función para cargar las configuraciones del periodo
  const fetchConfigs = async () => {
    if (!selectedPeriod.value) return
    try {
      const data = await apiRequest(`/api/report-config?periodo=${selectedPeriod.value}&t=${Date.now()}`)
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

  // Cargar datos
  const fetchKpis = async () => {
    try {
      const data = await apiRequest(`/api/network-kpis?periodo=${selectedPeriod.value}&red_social=${redSeleccionada.value}`)
      const hist = await apiRequest(`/api/network-kpis/historical?periodo=${selectedPeriod.value}&red_social=${redSeleccionada.value}`)

      if (Object.keys(data).length > 0 && data.id) {
        formData.value = { ...data }
        historicalData.value = Array.isArray(hist) ? hist : []
        datosCargados.value = true
      } else {
        formData.value = {}
        historicalData.value = []
        datosCargados.value = false
      }
    } catch (error) {
      console.error('Error cargando KPIs:', error)
    }
  }

  const escucharConfigCambios = event => {
    if (event.key === 'reporte_config_actualizada') {
      fetchConfigs()
    }
  }

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      // 1. Guardar KPIs globales
      await apiRequest('/api/network-kpis', {
        method: 'PUT',
        body: JSON.stringify({
          ...formData.value,
          periodo: selectedPeriod.value,
          red_social: redSeleccionada.value,
        }),
      })

      // 2. Guardar Histórico Diario si hay datos
      if (historicalData.value.length > 0) {
        await apiRequest('/api/network-kpis/historical', {
          method: 'PUT',
          body: JSON.stringify({
            periodo: selectedPeriod.value,
            red_social: redSeleccionada.value,
            historical: historicalData.value,
          }),
        })
      }

      showToast(`Métricas de ${redSeleccionada.value.toUpperCase()} actualizadas con éxito.`, 'success')
    } catch (error) {
      showToast('Error al actualizar las métricas.', 'error')
    }
  }

  // Reactividad: Solo vigila el periodo. (La red ya se vigila en el composable)
  watch(selectedPeriod, () => {
    fetchConfigs()
    fetchKpis()
  })

  // Reactividad extra: Si cambia la red, trae los KPIs de esa nueva red.
  watch(redSeleccionada, () => {
    fetchKpis()
  })

  onMounted(() => {
    fetchConfigs()
    fetchKpis()
    window.addEventListener('storage', escucharConfigCambios) // Para otras pestañas

    // Escuchamos el evento de esta misma pestaña
    window.addEventListener('config_actualizada_local', fetchConfigs)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', escucharConfigCambios)

    // Limpiamos la memoria
    window.removeEventListener('config_actualizada_local', fetchConfigs)
  })
</script>
