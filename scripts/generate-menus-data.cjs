const fs = require('fs');
const path = require('path');

const MENU_DIR = path.resolve(__dirname, '../menu');
const OUTPUT_FILE = path.resolve(__dirname, '../docs/.vitepress/theme/menus-data.ts');

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

const data = {};

for (const menu of MENU_LIST) {
  const mdPath = path.join(MENU_DIR, menu, 'raw', 'raw-markdown.md');
  const jsonPath = path.join(MENU_DIR, menu, 'raw', 'raw-markdown.json');

  const markdown = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  let keyboard = null;
  if (fs.existsSync(jsonPath)) {
    try {
      keyboard = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.warn(`Failed to parse JSON for ${menu}:`, e);
    }
  }

  data[menu] = {
    name: menu,
    markdown,
    keyboard
  };
}

const content = `export const MENUS_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
console.log('✅ Successfully updated docs/.vitepress/theme/menus-data.ts');
