const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get current like count
      const count = await redis.get('portfolio_likes') || 0; // Default to 0
      res.status(200).json({ likes: count });
    } 
    else if (req.method === 'POST') {
      // Increment like count
      const currentCount = await redis.get('portfolio_likes') || 0;
      const newCount = parseInt(currentCount) + 1;
      await redis.set('portfolio_likes', newCount);
      res.status(200).json({ likes: newCount });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
