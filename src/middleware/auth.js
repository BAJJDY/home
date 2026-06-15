/**
 * API 签名验证中间件
 */

const SECRET_KEY = process.env.VITE_API_SECRET_KEY || "BAJJDY_API_SECRET_KEY_2026_06_15";

/**
 * 验证签名
 * @param {string} signature - 请求签名
 * @param {string} timestamp - 时间戳
 * @returns {boolean} 是否验证通过
 */
const verifySignature = (signature, timestamp) => {
  try {
    const decoded = decodeURIComponent(atob(signature));
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    
    const [sigTimestamp, , sigKey] = parts;
    
    // 验证密钥
    if (sigKey !== SECRET_KEY) return false;
    
    // 验证时间戳（允许5分钟内的请求）
    const now = Date.now();
    const diff = Math.abs(now - parseInt(sigTimestamp));
    if (diff > 5 * 60 * 1000) return false;
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Vite 开发服务器中间件
 */
export const authMiddleware = () => {
  return {
    name: 'api-auth',
    configureServer(server) {
      server.middlewares.use('/api/', (req, res, next) => {
        const signature = req.headers['x-api-signature'];
        const timestamp = req.headers['x-api-timestamp'];
        
        if (!signature || !timestamp) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: 'Forbidden: Missing signature' }));
          return;
        }
        
        if (!verifySignature(signature, timestamp)) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: 'Forbidden: Invalid signature' }));
          return;
        }
        
        next();
      });
    }
  };
};

export default authMiddleware;