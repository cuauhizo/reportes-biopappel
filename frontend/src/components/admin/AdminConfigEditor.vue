<template>
  <section class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-10">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-100 pb-4">
      <div class="flex items-center">
        <Settings2 class="w-7 h-7 mr-3 text-gray-800" stroke-width="2.5" />
        <h2 class="text-2xl font-black text-gray-800 uppercase">Configuración de Visibilidad</h2>
      </div>

      <button @click="copiarMesAnterior" :disabled="isSaving" class="mt-4 md:mt-0 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
        <Copy class="w-4 h-4" />
        Copiar del mes anterior
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Visibilidad de Secciones</h3>
        <div class="space-y-4">
          <div v-for="sec in secciones" :key="sec.key" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p class="font-bold text-gray-700 text-sm">{{ sec.label }}</p>
              <p class="text-xs text-gray-400">Muestra u oculta esta pestaña completa en el reporte</p>
            </div>
            <button @click="toggleConfig(sec.key)" :class="configs[sec.key] ? sec.color : 'bg-gray-200'" class="w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer">
              <div :class="{ 'translate-x-6': configs[sec.key] }" class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Visibilidad de KPIs Específicos</h3>
        <div class="space-y-4">
          <div v-for="kpi in kpis" :key="kpi.key" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p class="font-bold text-gray-700 text-sm">{{ kpi.label }}</p>
              <p class="text-xs text-gray-400">{{ kpi.desc }}</p>
            </div>
            <button @click="toggleConfig(kpi.key)" :class="configs[kpi.key] ? 'bg-gray-800' : 'bg-gray-200'" class="w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer">
              <div :class="{ 'translate-x-6': configs[kpi.key] }" class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-amber-100 rounded-lg text-amber-800">
          <Lock v-if="configs['general_is_locked']" class="w-5 h-5" />
          <Unlock v-else class="w-5 h-5" />
        </div>
        <div>
          <p class="font-bold text-amber-900 text-sm">Bloquear edición de este periodo</p>
          <p class="text-xs text-amber-700">Si se activa, se deshabilitará la carga de archivos y edición de métricas en todo el admin para este mes.</p>
        </div>
      </div>
      <button @click="toggleConfig('general_is_locked')" :class="configs['general_is_locked'] ? 'bg-amber-600' : 'bg-gray-200'" class="w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer">
        <div :class="{ 'translate-x-6': configs['general_is_locked'] }" class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300"></div>
      </button>
    </div>

    <div class="mt-8 flex justify-end">
      <button @click="guardarConfiguraciones" :disabled="isSaving" class="bg-gray-800 text-white px-8 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50 flex items-center gap-2">
        <Save class="w-5 h-5" />
        <span>{{ isSaving ? 'Guardando...' : 'Guardar Preferencias' }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useApi } from '@/composables/useApi'
  import { usePeriod } from '@/composables/usePeriod'
  import { useToast } from '@/composables/useToast'
  import { useModal } from '@/composables/useModal'
  import { Settings2, Save, Copy, Lock, Unlock } from 'lucide-vue-next'

  const { apiRequest, isSaving } = useApi()
  const { showModal } = useModal()
  const { showToast } = useToast()
  const { selectedPeriod } = usePeriod()

  const configs = ref({})

  const secciones = [
    { key: 'general_show_contexto', label: 'Sección Contexto', color: 'bg-pluxeeBlue' },
    { key: 'general_show_benchmarking', label: 'Sección Benchmarking', color: 'bg-pluxeeBlue' },
    { key: 'general_show_facebook', label: 'Sección Facebook', color: 'bg-pluxeeBlue' },
    { key: 'general_show_instagram', label: 'Sección Instagram', color: 'bg-pluxeeBlue' },
    { key: 'general_show_linkedin', label: 'Sección LinkedIn', color: 'bg-pluxeeBlue' },
    { key: 'general_show_customerService', label: 'Sección Customer Service', color: 'bg-pluxeeBlue' },
    { key: 'general_show_frequentComplains', label: 'Sección Frequent Complains', color: 'bg-pluxeeBlue' },
    { key: 'general_show_nextSteps', label: 'Sección Next Steps', color: 'bg-pluxeeBlue' },
  ]

  const kpis = [
    { key: 'fb_show_sentiment', label: 'Sentimiento (Facebook)', desc: 'Muestra la gráfica de pastel de comunidad' },
    { key: 'ig_show_stories', label: 'Métricas de Stories', desc: 'Oculta taps forward, back y exits' },
    { key: 'li_show_post_reactions', label: 'Reacciones a publicaciones', desc: 'Muestra u oculta Reacciones a publicaciones en LinkedIn' },
    // { key: 'fb_show_responding', label: 'Respuestas a publicaciones', desc: 'Respuestas a publicaciones' },
    // { key: 'fb_show_response_time', label: 'Tiempo de respuesta a publicaciones', desc: 'Tiempo de respuesta a publicaciones' },
  ]

  const cargarConfiguraciones = async () => {
    if (!selectedPeriod.value) return
    try {
      const data = await apiRequest(`/api/report-config?periodo=${selectedPeriod.value}`)

      const baseConfigs = {}
      secciones.concat(kpis).forEach(item => {
        baseConfigs[item.key] = data[item.key] !== undefined ? data[item.key] : true
      })

      // 🚀 CAMBIO CLAVE: Leer y guardar el valor real del candado desde MySQL
      baseConfigs['general_is_locked'] = data['general_is_locked'] === true

      configs.value = baseConfigs
    } catch (e) {
      console.error(e)
    }
  }

  const toggleConfig = key => {
    configs.value[key] = !configs.value[key]
  }

  const guardarConfiguraciones = async () => {
    try {
      await apiRequest('/api/report-config', {
        method: 'PUT',
        body: JSON.stringify({ periodo: selectedPeriod.value, configs: configs.value }),
      })

      localStorage.setItem('reporte_config_actualizada', Date.now())
      window.dispatchEvent(new Event('config_actualizada_local'))

      showToast('Preferencias de visibilidad actualizadas', 'success')
    } catch (e) {
      showToast('Error al guardar configuraciones', 'error')
    }
  }

  const copiarMesAnterior = async () => {
    // Pedimos confirmación para no sobrescribir por accidente
    // if (!confirm('¿Estás seguro de copiar la configuración del mes anterior? Esto sobrescribirá la configuración actual de este mes.')) return

    const isConfirmed = await showModal({
      message: `¿Estás seguro de copiar la configuración del mes anterior?`,
    })

    if (!isConfirmed) {
      showToast('Operación cancelada.', 'error')
      return
    }

    try {
      await apiRequest('/api/report-config/copy-previous', {
        method: 'POST',
        body: JSON.stringify({ periodo: selectedPeriod.value }),
      })

      showToast('Configuración copiada exitosamente', 'success')

      // Volvemos a pedir los datos a la BD para que se actualicen los switches en pantalla
      await cargarConfiguraciones()

      // 🚀 Disparamos los eventos globales para que el Reporte y las otras pestañas reaccionen
      localStorage.setItem('reporte_config_actualizada', Date.now())
      window.dispatchEvent(new Event('config_actualizada_local'))
    } catch (e) {
      // Si mandamos un 404 porque no había datos, lo mostramos
      showToast(e.message || 'Error al copiar la configuración', 'error')
    }
  }

  watch(selectedPeriod, cargarConfiguraciones)
  onMounted(cargarConfiguraciones)
</script>
