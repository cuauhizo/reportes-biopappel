const findKey = (row, keywords) => {
  const keys = Object.keys(row)
  return keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase())))
}

const getValNum = (row, keywords) => {
  const key = findKey(row, keywords)
  return key ? parseFloat(row[key]) || 0 : 0
}

const getValStr = (row, keywords) => {
  const key = findKey(row, keywords)
  return key ? String(row[key]) : ''
}

const parseTikTokOverview = (results, periodo) => {
  let followers = []
  // 🚀 Agregamos total_followers y new_followers al objeto inicial
  let kpis = { total_followers: 0, new_followers: 0, tk_video_views: 0, tk_likes: 0, tk_comments: 0, tk_shares: 0, tk_reach: 0 }

  results.forEach(row => {
    const fechaRaw = getValStr(row, ['date', 'fecha'])
    const followersCount = getValNum(row, ['seguidores (daily', 'followers (daily'])

    // 🚀 BLOQUEO DE "N/A"
    if (fechaRaw && !isNaN(followersCount) && !fechaRaw.toLowerCase().includes('total') && fechaRaw.toUpperCase() !== 'N/A') {
      followers.push({
        periodo,
        red_social: 'tk',
        fecha: fechaRaw.split(' ')[0],
        followers: followersCount,
      })
    }

    const currentTotal = getValNum(row, ['seguidores (overall', 'total followers'])
    if (currentTotal > 0) kpis.total_followers = currentTotal

    const currentNew = getValNum(row, ['nuevos seguidores', 'new followers'])
    if (currentNew !== 0 || kpis.new_followers === 0) kpis.new_followers = currentNew

    kpis.tk_video_views += getValNum(row, ['visualizaciones de vídeos en publicaciones', 'video views'])
    kpis.tk_likes += getValNum(row, ['me gusta', 'reactions', 'likes'])
    kpis.tk_comments += getValNum(row, ['comentarios', 'comments'])
    kpis.tk_shares += getValNum(row, ['comparticiones', 'shares'])
    kpis.tk_reach += getValNum(row, ['audiencia alcanzada', 'alcance', 'reach'])
  })

  return { type: 'overview', followers, kpis }
}

const parseTikTokPosts = (results, periodo) => {
  let posts = []

  results.forEach(row => {
    const fechaRaw = getValStr(row, ['date', 'fecha'])

    // 🚀 BLOQUEO DE FILAS BASURA ("N/A", vacías o Totales)
    if (!fechaRaw || fechaRaw.toLowerCase().includes('total') || fechaRaw.toUpperCase() === 'N/A') return

    posts.push({
      periodo,
      date: fechaRaw, // Mantenemos fecha y hora
      permalink: getValStr(row, ['tiktok business post url', 'permalink', 'url']),
      post_message: getValStr(row, ['post message', 'mensaje']),
      media_type: getValStr(row, ['post type', 'media type', 'tipo']) || 'Video',
      tags: getValStr(row, ['post tags', 'etiquetas']) || null,
      campaign: getValStr(row, ['post campaign', 'campaña']) || null,
      video_views: getValNum(row, ['video views', 'visualizaciones']),
      reach: getValNum(row, ['reach', 'alcance', 'audiencia alcanzada']),
      likes: getValNum(row, ['reactions', 'likes', 'me gusta']),
      comments: getValNum(row, ['comments', 'comentarios']),
      shares: getValNum(row, ['shares', 'comparticiones']),
      engagement_rate: parseFloat(getValNum(row, ['engagement'])).toFixed(2),
    })
  })

  return { type: 'posts', posts }
}

module.exports = { parseTikTokOverview, parseTikTokPosts }
