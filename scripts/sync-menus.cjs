const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取 .env 配置
const envPath = path.join(__dirname, '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const REMOTE_HOST = env.REMOTE_HOST || '192.168.31.37';
const REMOTE_PORT = env.REMOTE_PORT || '22';
const REMOTE_USER = env.REMOTE_USER || 'root';
const REMOTE_MENU_DIR = env.REMOTE_MENU_DIR || '/home/world_story/SSoftwareFiles/koishi/koishi-o-O/data/qq-markdown-button-v2';
const LOCAL_MENU_DIR = path.resolve(__dirname, '..', env.LOCAL_MENU_DIR || 'menu');

const MENU_LIST = [
  '帮助菜单',
  '关于bot',
  'Minecraft菜单',
  '光遇菜单',
  'cs2菜单',
  '点歌菜单',
  '绘图菜单',
  '工具菜单',
  '资讯菜单'
];

console.log(`🚀 开始从远程主机 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT} 同步最新菜单...`);
fs.mkdirSync(LOCAL_MENU_DIR, { recursive: true });

for (const menu of MENU_LIST) {
  const targetDir = path.join(LOCAL_MENU_DIR, menu, 'raw');
  fs.mkdirSync(targetDir, { recursive: true });

  const remoteMd = `${REMOTE_MENU_DIR}/${menu}/raw/raw-markdown.md`;
  const remoteJson = `${REMOTE_MENU_DIR}/${menu}/raw/raw-markdown.json`;

  try {
    execSync(`scp -P ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST}:"${remoteMd}" "${targetDir}/raw-markdown.md"`, { stdio: 'inherit' });
    console.log(`✅ [${menu}] 成功同步 raw-markdown.md`);
  } catch (err) {
    console.warn(`⚠️ [${menu}] 无法获取 raw-markdown.md: ${err.message}`);
  }

  try {
    execSync(`scp -P ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST}:"${remoteJson}" "${targetDir}/raw-markdown.json"`, { stdio: 'inherit' });
    console.log(`✅ [${menu}] 成功同步 raw-markdown.json`);
  } catch (err) {
    console.warn(`⚠️ [${menu}] 无法获取 raw-markdown.json (跳过)`);
  }
}

console.log('🎉 菜单同步完成！已自动过滤历史备份与冗余文件。');
