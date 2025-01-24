const net = require('net');
const fs = require('fs');
const path = require('path');

// 检查端口是否可用
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// 查找可用端口
async function findAvailablePort(startPort) {
  let port = startPort;
  
  while (port < startPort + 1000) { // 最多尝试1000个端口
    const isAvailable = await isPortAvailable(port);
    if (isAvailable) {
      return port;
    }
    port++;
  }
  
  throw new Error('无法找到可用端口');
}

// 更新vite配置文件
function updateViteConfig(port) {
  const configPath = path.resolve(process.cwd(), 'vite.config.ts');
  
  try {
    let content = fs.readFileSync(configPath, 'utf-8');
    
    // 如果配置文件中已经有server.port配置
    if (content.includes('server: {')) {
      content = content.replace(
        /server:\s*{[^}]*}/,
        `server: {\n    port: ${port},\n    host: true\n  }`
      );
    } else {
      // 如果没有server配置，在export default前添加
      content = content.replace(
        /export default defineConfig\({/,
        `export default defineConfig({\n  server: {\n    port: ${port},\n    host: true\n  },`
      );
    }
    
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log(`✅ 已更新vite配置，使用端口: ${port}`);
  } catch (err) {
    console.error('更新vite配置失败:', err);
    process.exit(1);
  }
}

async function main() {
  try {
    const defaultPort = process.env.PORT || 3000;
    const isDefaultPortAvailable = await isPortAvailable(defaultPort);
    
    if (isDefaultPortAvailable) {
      console.log(`✅ 默认端口 ${defaultPort} 可用`);
      updateViteConfig(defaultPort);
      return;
    }
    
    console.log(`⚠️ 端口 ${defaultPort} 已被占用，正在查找可用端口...`);
    const availablePort = await findAvailablePort(defaultPort + 1);
    console.log(`✅ 找到可用端口: ${availablePort}`);
    updateViteConfig(availablePort);
    
  } catch (err) {
    console.error('错误:', err.message);
    process.exit(1);
  }
}

main(); 