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

const isReverse = process.argv.includes('-r') || process.argv.includes('--reverse') || process.argv.includes('push');

if (isReverse) {
  console.log(`📤 [Push 模式] 开始将本地菜单推送到远程 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}...`);
  for (const menu of MENU_LIST) {
    const localRawDir = path.join(LOCAL_MENU_DIR, menu, 'raw');
    const localMd = path.join(localRawDir, 'raw-markdown.md');
    const localNoKb = path.join(localRawDir, 'raw-without-keyboard.md');
    const localJson = path.join(localRawDir, 'raw-markdown.json');

    const remoteRawDir = `${REMOTE_MENU_DIR}/${menu}/raw`;

    if (fs.existsSync(localMd)) {
      execSync(`scp -P ${REMOTE_PORT} "${localMd}" ${REMOTE_USER}@${REMOTE_HOST}:"${remoteRawDir}/raw-markdown.md"`, { stdio: 'inherit' });
      // 同时同步无键盘版
      if (fs.existsSync(localNoKb)) {
        execSync(`scp -P ${REMOTE_PORT} "${localNoKb}" ${REMOTE_USER}@${REMOTE_HOST}:"${remoteRawDir}/raw-without-keyboard.md"`, { stdio: 'inherit' });
      } else {
        execSync(`scp -P ${REMOTE_PORT} "${localMd}" ${REMOTE_USER}@${REMOTE_HOST}:"${remoteRawDir}/raw-without-keyboard.md"`, { stdio: 'inherit' });
      }
      console.log(`✅ [${menu}] 成功推送 markdown 到远程服务器`);
    }

    if (fs.existsSync(localJson)) {
      execSync(`scp -P ${REMOTE_PORT} "${localJson}" ${REMOTE_USER}@${REMOTE_HOST}:"${remoteRawDir}/raw-markdown.json"`, { stdio: 'inherit' });
      console.log(`✅ [${menu}] 成功推送 raw-markdown.json 到远程服务器`);
    }
  }
  console.log('🎉 菜单推送完成！线上 Koishi 机器人已热生效。');
} else {
  console.log(`📥 [Pull 模式] 开始从远程主机 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT} 同步最新菜单...`);
  fs.mkdirSync(LOCAL_MENU_DIR, { recursive: true });

  for (const menu of MENU_LIST) {
    const targetDir = path.join(LOCAL_MENU_DIR, menu, 'raw');
    fs.mkdirSync(targetDir, { recursive: true });

    const remoteMd = `${REMOTE_MENU_DIR}/${menu}/raw/raw-markdown.md`;
    const remoteJson = `${REMOTE_MENU_DIR}/${menu}/raw/raw-markdown.json`;

    try {
      execSync(`scp -P ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST}:"${remoteMd}" "${targetDir}/raw-markdown.md"`, { stdio: 'inherit' });
      console.log(`✅ [${menu}] 成功同步 raw-markdown.md`);
      // 保持 raw-without-keyboard.md 一致
      fs.copyFileSync(path.join(targetDir, 'raw-markdown.md'), path.join(targetDir, 'raw-without-keyboard.md'));
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
}
