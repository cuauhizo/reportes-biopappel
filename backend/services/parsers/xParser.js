const parseXOverview = (results, periodo) => {
  let followers = []
  let kpis = {
    x_impressions: 0,
    x_likes: 0,
    x_reposts: 0,
    x_replies: 0,
    x_url_clicks: 0,
  }

  results.forEach(row => {
    const fecha = row['Date (GMT)'] || row['Date']
    const followersCount = parseInt(row['Seguidores (Daily aggregated...)'] || row['Followers'] || 0)

    if (fecha && !isNaN(followersCount)) {
      followers.push({
        periodo,
        red_social: 'x',
        fecha: fecha.split(' ')[0],
        followers: followersCount,
      })
    }

    // Sumar KPIs Globales
    kpis.x_impressions += parseInt(row['Impresiones de publicaciones (Daily...)'] || row['Impressions'] || 0)
    kpis.x_likes += parseInt(row['Interacciones con publicaciones'] || row['Likes'] || 0) // Asumiendo que Hootsuite lo mezcla, ajusta según tu CSV
    kpis.x_reposts += parseInt(row['Retweets'] || row['Reposts'] || 0)
    kpis.x_replies += parseInt(row['Respuestas'] || row['Replies'] || 0)
    kpis.x_url_clicks += parseInt(row['Clics en enlaces'] || row['URL Clicks'] || 0)
  })

  return { type: 'overview', followers, kpis }
}

const parseXPosts = (results, periodo) => {
  let posts = []

  results.forEach(row => {
    const fechaStr = row['Date (GMT)'] || row['Date']
    if (!fechaStr) return

    posts.push({
      periodo,
      date: fechaStr,
      permalink: row['Tweet Permalink'] || row['Permalink'] || '',
      post_message: row['Tweet Text'] || row['Post Message'] || '',
      media_type: row['Media Type'] || 'Tweet',
      tags: row['Tweet Tags'] || null,
      campaign: row['Tweet Campaign'] || null,
      impressions: parseInt(row['Impressions'] || 0),
      reposts: parseInt(row['Retweets'] || row['Reposts'] || 0),
      quote_tweets: parseInt(row['Quote Tweets'] || 0),
      likes: parseInt(row['Likes'] || 0),
      replies: parseInt(row['Replies'] || 0),
      url_clicks: parseInt(row['URL Clicks'] || 0),
      engagement_rate: parseFloat(row['Engagement Rate'] || 0).toFixed(2),
    })
  })

  return { type: 'posts', posts }
}

module.exports = { parseXOverview, parseXPosts }
