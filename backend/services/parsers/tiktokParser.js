const parseTikTokOverview = (results, periodo) => {
  let followers = []
  let kpis = {
    tk_video_views: 0,
    tk_likes: 0,
    tk_comments: 0,
    tk_shares: 0,
    tk_reach: 0,
  }

  results.forEach(row => {
    // 1. Extraer Histórico de Seguidores
    const fecha = row['Date (GMT)'] || row['Date']
    const followersCount = parseInt(row['Seguidores (Daily aggregated'] || row['Followers'] || 0)

    if (fecha && !isNaN(followersCount)) {
      followers.push({
        periodo,
        red_social: 'tk',
        fecha: fecha.split(' ')[0], // Solo la fecha YYYY-MM-DD
        followers: followersCount,
      })
    }

    // 2. Sumar KPIs Globales
    kpis.tk_video_views += parseInt(row['Visualizaciones de vídeos en publicaciones (Daily'] || row['Video views'] || 0) //
    kpis.tk_likes += parseInt(row['Me gusta en publicaciones'] || row['Reactions'] || row['Likes'] || 0) //
    kpis.tk_comments += parseInt(row['Comentarios (Overall aggregated value'] || row['Comments'] || 0)
    kpis.tk_shares += parseInt(row['Comparticiones (Overall aggregated value'] || row['Shares'] || 0)
    kpis.tk_reach += parseInt(row['Alcance'] || row['Reach'] || 0)
  })

  return { type: 'overview', followers, kpis }
}

const parseTikTokPosts = (results, periodo) => {
  let posts = []

  results.forEach(row => {
    const fechaStr = row['Date (GMT)'] || row['Date']
    if (!fechaStr) return

    posts.push({
      periodo,
      date: fechaStr,
      permalink: row['TikTok Business Post URL'] || row['Permalink'] || '',
      post_message: row['Post Message'] || '',
      media_type: 'Video',
      tags: row['Post Tags'] || null,
      campaign: row['Post Campaign'] || null,
      video_views: parseInt(row['Video views'] || 0),
      reach: parseInt(row['Reach'] || 0),
      likes: parseInt(row['Reactions'] || row['Likes'] || 0),
      comments: parseInt(row['Comments'] || 0),
      shares: parseInt(row['Shares'] || 0),
      engagement_rate: parseFloat(row['Engagement'] || row['Engagement Rate'] || 0).toFixed(2),
    })
  })

  return { type: 'posts', posts }
}

module.exports = { parseTikTokOverview, parseTikTokPosts }
