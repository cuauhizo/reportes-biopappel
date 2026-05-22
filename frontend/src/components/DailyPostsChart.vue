<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 h-full flex flex-col" :style="{ borderColor: color }">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Publicaciones Diarias</h3>
    <div class="relative w-full flex-1 min-h-[200px]">
      <Bar v-if="chartDataObj" :data="chartDataObj" :options="chartOptions" />
      <div v-else class="flex h-full items-center justify-center text-gray-400 font-medium text-center">No hay datos de publicaciones para graficar</div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
  import { formatDate } from '@/utils/formatters'

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

  const props = defineProps({
    chartData: { type: [Array, Object, null], default: () => [] },
    color: { type: String, default: '#1877F2' },
  })

  const chartDataObj = computed(() => {
    if (!props.chartData || !Array.isArray(props.chartData) || props.chartData.length === 0) return null

    return {
      labels: props.chartData.map(item => formatDate(item.date) || ''),
      datasets: [
        {
          label: 'Posts Publicados',
          data: props.chartData.map(item => item.posts || 0),
          backgroundColor: props.color,
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    }
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 10, color: '#9ca3af' } },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#9ca3af', stepSize: 1, precision: 0 },
        beginAtZero: true,
      },
    },
  }
</script>
