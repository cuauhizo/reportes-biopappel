<template>
  <section class="pdf-page flex flex-col bg-gray-100">
    <div class="w-full md:h-24 bg-gray-800 shrink-0 flex items-center justify-center shadow-inner p-4">
      <h2 class="text-4xl text-center font-black text-white tracking-widest uppercase">X (Twitter) Metrics</h2>
    </div>
    <!-- <pre>{{ data }}</pre> -->
    <div class="flex-1 flex flex-col justify-start p-4 w-full">
      <div class="max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center h-full">
              <KpiCard title="Total followers" :value="formatNumber(data.kpis?.total_followers)" :diff="data.kpis.followers_diff" :hideNegativeDiff="config.general_hide_negative_diffs === true" />
              <KpiCard title="Impressions" :value="formatNumber(data.kpis?.x_impressions)" />
              <KpiCard title="Reposts" :value="formatNumber(data.kpis?.x_reposts)" />
              <KpiCard title="Engagement rate" :value="(data.kpis?.engagement_rate || 0) + '%'" :diff="data.kpis.engagement_rate_diff" :hideNegativeDiff="config.general_hide_negative_diffs === true" />
              <KpiCard title="Likes" :value="formatNumber(data.kpis?.x_likes)" />
              <KpiCard title="Replies" :value="formatNumber(data.kpis?.x_replies)" />
              <KpiCard title="URL Clicks" :value="formatNumber(data.kpis?.x_url_clicks)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pdf-page flex flex-col justify-center bg-gray-100">
    <div class="max-w-7xl mx-auto p-4 w-full">
      <h2 class="text-2xl font-black text-gray-800 mb-6 uppercase keep-with-next">Account Growth</h2>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6">
          <FollowerGrowthChart color="#1f2937" class="h-full" v-if="data.historicalFollowers && data.historicalFollowers.length > 0" :chartData="data.historicalFollowers" />
        </div>
        <div class="col-span-12 lg:col-span-6">
          <DailyPostsChart color="#6b7280" class="h-full" v-if="data.historicalFollowers && data.historicalFollowers.length > 0" :chartData="data.historicalFollowers" />
        </div>
      </div>
    </div>
  </section>

  <template v-if="mappedPosts && mappedPosts.length > 0">
    <section v-for="(grupo, index) in agruparPorFilas(mappedPosts, 10)" :key="'pagina-post-x-' + index" class="pdf-page flex flex-col justify-start bg-gray-50">
      <div class="max-w-7xl mx-auto p-4 w-full">
        <h2 class="text-2xl font-black text-gray-800 mb-2 uppercase keep-with-next">Post Metrics</h2>
        <p class="text-sm text-gray-600 mb-2 font-bold">Ordenados de mayor a menor rendimiento en X</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 mt-6">
          <PostCard v-for="post in grupo" :key="post.id" :post="post" />
        </div>
      </div>
    </section>
  </template>

  <section v-else class="pdf-page flex flex-col justify-center min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto w-full">
      <h2 class="text-2xl font-black text-gray-800 mb-2 uppercase">Post Metrics</h2>
      <div class="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 mt-6">
        <p class="text-gray-500 font-medium">No se encontraron publicaciones en X para este periodo.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { computed } from 'vue'
  import PostCard from '@/components/PostCard.vue'
  import KpiCard from '@/components/KpiCard.vue'
  import FollowerGrowthChart from '@/components/FollowerGrowthChart.vue'
  import DailyPostsChart from '@/components/DailyPostsChart.vue'
  import { formatNumber } from '@/utils/formatters'

  const props = defineProps({
    data: { type: Object, required: true },
    config: { type: Object, default: () => ({}) },
  })

  // Función para dividir las tarjetas en filas y que no rompan el PDF
  const agruparPorFilas = (arreglo, tamañoFila) => {
    if (!arreglo || !arreglo.length) return []
    return Array.from({ length: Math.ceil(arreglo.length / tamañoFila) }, (v, i) => arreglo.slice(i * tamañoFila, i * tamañoFila + tamañoFila))
  }

  // 🚀 Adaptador inteligente para las tarjetas visuales (PostCard)
  const mappedPosts = computed(() => {
    if (!props.data.posts) return []
    return props.data.posts.map(p => ({
      id: p.id,
      link: p.permalink,
      type: p.media_type ? p.media_type.toUpperCase() : 'TWEET',
      views: p.impressions || 0,
      reach: p.impressions || 0,
      interactions: (p.likes || 0) + (p.reposts || 0) + (p.replies || 0),
      likes: p.likes || 0,
      shares: p.reposts || 0,
      img: p.img,
      text: p.post_message ? p.post_message.substring(0, 60) + '...' : 'Sin texto',
      date: p.date ? new Date(p.date).toISOString().split('T')[0] : 'Sin fecha',
      tags: p.tags || 'Sin etiqueta',
    }))
  })
</script>
