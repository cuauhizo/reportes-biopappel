<template>
  <div class="flex flex-col w-full max-w-64 shadow-lg rounded-lg overflow-hidden mx-auto">
    <div class="bg-pluxeeBlue p-2 h-36">
      <div class="w-full h-full bg-cover bg-center bg-no-repeat rounded-sm" :style="{ backgroundImage: `url(${getImageUrl})` }"></div>
    </div>
    <div class="bg-pluxeeYellow p-3 text-pluxeeBlue font-sans">
      <div class="font-bold text-xs mb-1 uppercase tracking-widest text-center">
        {{ post.type }}
      </div>
      <div class="text-sm space-y-0.5">
        <p>
          <strong>Visualizaciones:</strong>
          {{ formatNumber(post.views) }}
        </p>
        <p>
          <strong>Alcance:</strong>
          {{ formatNumber(post.reach) }}
        </p>
        <p>
          <strong>Interactions:</strong>
          {{ formatNumber(post.interactions) }}
        </p>
        <p>
          <strong>Shared o saved:</strong>
          {{ formatNumber(post.saved || post.shares) }}
        </p>
        <p class="text-end">
          <a :href="post.postPermalink" target="_blank"><strong>Ver en línea</strong></a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { formatNumber } from '@/utils/formatters'

  const props = defineProps({
    post: Object,
  })

  // ✨ FUNCIÓN LIMPIA: Formatea la ruta de la imagen
  const getImageUrl = computed(() => {
    // 1. Buscamos la imagen que mandó el backend (puede venir con distintos nombres)
    const url = props.post.img || props.post.picture || props.post.image_url

    // 2. Si por algún error extremo llega vacío, mandamos un lienzo gris (NUNCA el favicon)
    if (!url) {
      return 'https://placehold.co/300x400/64748b/ffffff?text=Sin+Imagen'
    }

    // 3. Si la URL ya es de internet (ej. las de Placehold.co que manda tu backend)
    if (url.startsWith('http')) return url

    // 4. Si es una captura subida por ti, le pegamos la ruta de tu servidor local/producción
    const cleanUrl = url.replace(/\\/g, '/')
    const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${backendBaseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`
  })
</script>
