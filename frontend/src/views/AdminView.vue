<template>
  <div class="min-h-screen bg-gray-50 py-10 font-sans text-gray-800">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col justify-between items-center mb-10 md:flex-row">
        <div>
          <h1 class="text-3xl mb-4 text-center font-black text-pluxeeBlue uppercase md:text-4xl md:text-start">Panel de Administración</h1>
          <div class="fixed z-10 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
            <CalendarRange class="w-8 h-8 text-pluxeePink" />
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Periodo a editar</span>
              <input type="month" v-model="selectedPeriod" min="2026-01" :max="maxMonth" class="font-black text-pluxeePink outline-none bg-transparent cursor-pointer" />
            </div>
          </div>
        </div>
        <div class="flex gap-4">
          <button @click="cerrarSesion" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition ml-2 flex items-center gap-2">
            Salir
            <LogOut class="h-5 w-5" />
          </button>
          <router-link to="/" target="_blank" class="bg-pluxeeBlue text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition flex items-center gap-2">
            Ver Reporte
            <Proportions class="h-5 w-5" />
          </router-link>
        </div>
      </div>

      <div v-if="alert.show" :class="alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'" class="fixed bottom-10 right-10 z-50 text-white px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 transition-all">
        <span v-if="alert.type === 'success'" class="text-2xl"><Check /></span>
        <span v-else class="text-2xl">
          <X />
        </span>
        {{ alert.message }}
      </div>

      <div v-if="configs['general_is_locked']" class="mb-6 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-md animate-pulse">
        <Lock class="w-6 h-6" />
        <span>PERIODO CONGELADO: La edición de datos y carga de archivos está deshabilitada para el mes de {{ selectedPeriod }}.</span>
      </div>

      <AdminConfigEditor />
      <div class="relative">
        <div v-if="configs['general_is_locked']" class="absolute inset-0 bg-gray-100/10 cursor-not-allowed z-40" title="Desbloquea el periodo en la sección de configuración para editar"></div>

        <div :class="{ 'opacity-50 pointer-events-none select-none': configs['general_is_locked'] }" class="transition-opacity duration-300 space-y-10">
          <AdminContextEditor v-if="configs.general_show_contexto !== false" />
          <AdminBenchmarkEditor v-if="configs.general_show_benchmarking !== false" />
          <AdminFilesEditor />
          <AdminGalleryEditor />
          <AdminAuditEditor />
          <AdminPostsEditor />
          <AdminQuejasEditor v-if="configs.general_show_frequentComplains !== false" />
          <AdminCustomerServiceEditor v-if="configs.general_show_customerService !== false" />
          <AdminPropuestasEditor v-if="configs.general_show_nextSteps !== false" />
          <AdminCompromisosEditor v-if="configs.general_show_nextSteps !== false" />
          <AdminConclusionEditor />
          <div class="mt-16 mb-20 p-8 bg-red-50 border-2 border-red-200 border-dashed rounded-2xl flex flex-col items-center text-center">
            <h3 class="text-2xl font-black text-red-600 uppercase mb-2 flex items-center">
              <TriangleAlert class="w-7 h-7 mr-3" stroke-width="2.5" />
              Zona de Peligro
            </h3>
            <p class="text-red-500 mb-6 font-medium">
              ¿Subiste archivos equivocados o el mes se corrompió? Presiona este botón para eliminar TODOS los datos, posts, contextos y gráficas del periodo
              <b>{{ selectedPeriod }}</b>
              .
            </p>
            <button @click="borrarMesCompleto" class="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-red-700 hover:scale-105 transition shadow-lg flex items-center">FORMATEAR MES ACTUAL</button>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from '@/composables/useToast'
  import { usePeriod } from '@/composables/usePeriod'
  import { useApi } from '@/composables/useApi'
  import { useModal } from '@/composables/useModal'
  import { CalendarRange, LogOut, Proportions, TriangleAlert, Check, X, Lock } from 'lucide-vue-next'
  import ConfirmModal from '@/components/admin/ConfirmModal.vue'
  import AdminContextEditor from '@/components/admin/AdminContextEditor.vue'
  import AdminConfigEditor from '@/components/admin/AdminConfigEditor.vue'
  import AdminQuejasEditor from '@/components/admin/AdminQuejasEditor.vue'
  import AdminPropuestasEditor from '@/components/admin/AdminPropuestasEditor.vue'
  import AdminCompromisosEditor from '@/components/admin/AdminCompromisosEditor.vue'
  import AdminCustomerServiceEditor from '@/components/admin/AdminCustomerServiceEditor.vue'
  import AdminBenchmarkEditor from '@/components/admin/AdminBenchmarkEditor.vue'
  import AdminConclusionEditor from '@/components/admin/AdminConclusionEditor.vue'
  import AdminGalleryEditor from '@/components/admin/AdminGalleryEditor.vue'
  import AdminAuditEditor from '@/components/admin/AdminAuditEditor.vue'
  import AdminPostsEditor from '@/components/admin/AdminPostsEditor.vue'
  import AdminFilesEditor from '@/components/admin/AdminFilesEditor.vue'

  const router = useRouter()
  const { apiRequest } = useApi()
  const { showModal } = useModal()
  const { alert, showToast } = useToast()
  const { selectedPeriod } = usePeriod()
  const configs = ref({})

  const borrarMesCompleto = async () => {
    // 🚀 INVOCAMOS EL NUEVO MODAL HERMOSO
    const isConfirmed = await showModal({
      title: '⚠️ ZONA DE PELIGRO',
      message: `Estás a punto de borrar ABSOLUTAMENTE TODO el trabajo, datos y reportes de ${selectedPeriod.value}.\n\nPara confirmar la destrucción, escribe exactamente el periodo:`,
      type: 'prompt', // Pide validación de texto
      expectedInput: selectedPeriod.value, // La palabra a escribir
      confirmText: 'Destruir Todo',
      cancelText: 'Me arrepentí',
    })

    if (!isConfirmed) {
      showToast('Operación cancelada.', 'error')
      return
    }

    try {
      await apiRequest(`/api/reports/reset/${selectedPeriod.value}`, { method: 'DELETE' })
      showToast('Toda la información del mes ha sido eliminada.', 'success')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      showToast('Error al limpiar el mes', 'error')
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  // Función para traer las configuraciones rompiendo caché
  const fetchConfigs = async () => {
    if (!selectedPeriod.value) return
    try {
      const data = await apiRequest(`/api/report-config?periodo=${selectedPeriod.value}&t=${Date.now()}`)
      configs.value = data || {}
    } catch (error) {
      console.error('Error cargando configuraciones globales del admin:', error)
    }
  }

  // Escuchadores de cambios
  const escucharConfigCambios = event => {
    if (event.key === 'reporte_config_actualizada') fetchConfigs()
  }

  const maxMonth = computed(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  })

  // Si cambiamos de mes, refrescamos los paneles
  watch(selectedPeriod, () => {
    fetchConfigs()
  })

  onMounted(() => {
    fetchConfigs()
    // Escucha a otras pestañas
    window.addEventListener('storage', escucharConfigCambios)
    // Escucha a esta misma pestaña (cuando guardas en AdminConfigEditor)
    window.addEventListener('config_actualizada_local', fetchConfigs)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', escucharConfigCambios)
    window.removeEventListener('config_actualizada_local', fetchConfigs)
  })
</script>
