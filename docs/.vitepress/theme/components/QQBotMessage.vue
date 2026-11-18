<template>
  <div class="qq-chat-wrapper">
    <!-- 顶部菜单选择 Tabs -->
    <div v-if="showTabs" class="menu-tabs">
      <button
        v-for="m in menuList"
        :key="m.key"
        :class="['tab-btn', { active: currentMenuKey === m.key }]"
        @click="switchMenu(m.key)"
      >
        {{ m.label }}
      </button>
    </div>

    <!-- 1:1 仿真 QQ 聊天舞台 -->
    <div class="qq-chat-stage">
      <div class="qq-message-row">
        <!-- 左侧 Bot 头像 -->
        <div class="qq-avatar-wrapper">
          <img :src="resolvedAvatar" alt="Bot Avatar" class="qq-avatar" />
        </div>

        <!-- 右侧消息主体 -->
        <div class="qq-message-content">
          <!-- 昵称与认证角标 -->
          <div class="qq-bot-header">
            <span class="qq-bot-name">{{ botName }}</span>
            <span class="qq-bot-badge" title="QQ 官方机器人">
              <svg viewBox="0 0 24 24" class="badge-icon">
                <path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a5 5 0 0 1 5-5h2V5.72A2 2 0 0 1 10 4a2 2 0 0 1 2-2m-3 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
              </svg>
            </span>
          </div>

          <!-- 消息气泡卡片 -->
          <div class="qq-bubble-card">
            <div class="qq-markdown-body" v-html="renderedHtml"></div>

            <!-- 底栏键盘按钮 (Keyboard) -->
            <div v-if="keyboardRows && keyboardRows.length" class="qq-keyboard">
              <div v-for="(row, rIdx) in keyboardRows" :key="rIdx" class="keyboard-row">
                <button
                  v-for="(btn, bIdx) in row.buttons"
                  :key="bIdx"
                  class="keyboard-btn"
                  @click="handleButtonClick(btn)"
                >
                  <span v-if="btn.action?.type === 0" class="btn-link-icon" title="外部链接">
                    <svg viewBox="0 0 24 24" class="link-svg">
                      <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"/>
                    </svg>
                  </span>
                  <span class="btn-label">{{ btn.render_data?.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制成功的轻量级 Toast 提示 -->
    <transition name="toast-fade">
      <div v-if="toastVisible" class="qq-toast">
        <span class="toast-icon">📋</span>
        <span class="toast-text">{{ toastText }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { MENUS_DATA } from '../menus-data'

const props = withDefaults(
  defineProps<{
    initialMenu?: string
    showTabs?: boolean
    botName?: string
    avatarUrl?: string
  }>(),
  {
    initialMenu: '帮助菜单',
    showTabs: true,
    botName: '可爱zyu的bot',
    avatarUrl: '/images/bot-avatar-v2.png'
  }
)

const resolvedAvatar = computed(() => withBase(props.avatarUrl))

const menuList = [
  { key: '帮助菜单', label: '📋 帮助导览' },
  { key: 'cs2菜单', label: '🎮 Steam & CS2' },
  { key: '资讯菜单', label: '📰 资讯行情' },
  { key: '工具菜单', label: '🛠️ 工具与市场' },
  { key: 'Minecraft菜单', label: '🎮 Minecraft' },
  { key: '光遇菜单', label: '🕊️ 光遇' },
  { key: '绘图菜单', label: '🎨 绘图整活' },
  { key: '点歌菜单', label: '🎵 点歌' },
  { key: '关于bot', label: 'ℹ️ 关于' }
]

const currentMenuKey = ref(props.initialMenu)
const toastVisible = ref(false)
const toastText = ref('')
let toastTimer: any = null

function switchMenu(key: string) {
  currentMenuKey.value = key
}

function findMatchingMenu(cmd: string): string | null {
  const clean = cmd.trim().replace(/^\//, '').trim().toLowerCase()
  if (!clean) return null

  // 1. 完全或不区分大小写匹配已有菜单键
  for (const m of menuList) {
    if (m.key.toLowerCase() === clean) return m.key
  }

  // 2. 匹配已有菜单 key 包含或被包含
  for (const m of menuList) {
    const mk = m.key.toLowerCase()
    if (clean.includes(mk) || mk.includes(clean)) return m.key
  }

  // 3. 常见指令别名与快捷关键字
  if (clean === 'help' || clean.includes('帮助') || clean === 'menu') return '帮助菜单'
  if (clean.includes('关于') || clean === 'about') return '关于bot'
  if (clean.includes('cs2') || clean.includes('steam')) return 'cs2菜单'
  if (clean.includes('mc') || clean.includes('minecraft')) return 'Minecraft菜单'
  if (clean.includes('光遇') || clean.includes('sky')) return '光遇菜单'
  if (clean.includes('资讯') || clean.includes('news')) return '资讯菜单'
  if (clean.includes('工具') || clean.includes('tool')) return '工具菜单'
  if (clean.includes('绘图') || clean.includes('整活') || clean.includes('draw')) return '绘图菜单'
  if (clean.includes('点歌') || clean.includes('music')) return '点歌菜单'

  return null
}

function handleCommandTrigger(cmd: string) {
  // 复制到剪贴板
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(cmd).catch(() => {})
  }

  // 检查是否跳转到对应菜单
  const matchedMenuKey = findMatchingMenu(cmd)
  if (matchedMenuKey && (MENUS_DATA as any)[matchedMenuKey]) {
    switchMenu(matchedMenuKey)
    const matched = menuList.find(m => m.key === matchedMenuKey)
    const label = matched ? matched.label : matchedMenuKey
    showToast(`已切换至 ${label} 并复制指令`)
  } else {
    showToast(`已复制指令: ${cmd}`)
  }
}

const currentMenuData = computed(() => {
  return (MENUS_DATA as any)[currentMenuKey.value] || null
})

const keyboardRows = computed(() => {
  return currentMenuData.value?.keyboard?.keyboard?.content?.rows || []
})

// 解析 QQ 官方 Markdown 并高保真渲染
const renderedHtml = computed(() => {
  if (!currentMenuData.value?.markdown) return ''
  let md = currentMenuData.value.markdown

  // 1. 转义基础标签但保留我们的组件
  // 替换 <qqbot-cmd-input text="..." show="..."/> 为可点击标签
  md = md.replace(/<qqbot-cmd-input\s+text="([^"]+)"\s+show="([^"]+)"\s*\/?>/g, (match: string, text: string, show: string) => {
    return `<span class="qq-cmd-input" data-cmd="${escapeAttr(text)}" title="点击跳转并复制: ${escapeAttr(text)}">${escapeHtml(show)}</span>`
  })

  // 2. 简易安全的 Markdown 解析器
  const lines = md.split('\n')
  const htmlLines: string[] = []
  let inBlockquote = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // 标题
    if (line.startsWith('# ')) {
      if (inBlockquote) { htmlLines.push('</blockquote>'); inBlockquote = false; }
      htmlLines.push(`<h1 class="qq-h1">${parseInline(line.slice(2))}</h1>`)
      continue
    }

    // 图片 ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      if (inBlockquote) { htmlLines.push('</blockquote>'); inBlockquote = false; }
      let src = imgMatch[2]
      htmlLines.push(`<div class="qq-img-box"><img src="${src}" alt="${imgMatch[1]}" class="qq-body-img" loading="lazy" /></div>`)
      continue
    }

    // 引用块 >
    if (line.startsWith('> ')) {
      if (!inBlockquote) {
        htmlLines.push('<blockquote class="qq-blockquote">')
        inBlockquote = true
      }
      htmlLines.push(`<p class="qq-quote-line">${parseInline(line.slice(2))}</p>`)
      continue
    } else {
      if (inBlockquote) {
        htmlLines.push('</blockquote>')
        inBlockquote = false
      }
    }

    if (!line.trim()) {
      htmlLines.push('<div class="qq-space"></div>')
      continue
    }

    htmlLines.push(`<p class="qq-p">${parseInline(line)}</p>`)
  }

  if (inBlockquote) htmlLines.push('</blockquote>')
  return htmlLines.join('\n')
})

function parseInline(text: string): string {
  // 粗体 **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // 斜体 *text*
  text = text.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3')
  // 分隔符 ｜
  text = text.replace(/ ｜ /g, ' <span class="qq-divider">｜</span> ')
  return text
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;')
}

function showToast(msg: string) {
  toastText.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2000)
}

function handleButtonClick(btn: any) {
  const action = btn.action
  if (action?.type === 0 && action?.data) {
    // URL 跳转
    window.open(action.data, '_blank')
  } else if (action?.type === 2 && action?.data) {
    const cmd = action.data.trim()
    handleCommandTrigger(cmd)
  }
}

function handleGlobalClick(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest('.qq-cmd-input') as HTMLElement
  if (target && target.dataset.cmd) {
    const cmd = target.dataset.cmd
    handleCommandTrigger(cmd)
  }
}

// 代理事件委托处理蓝字点击
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.qq-chat-wrapper {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 顶部选择 Tabs */
.menu-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
  max-width: 680px;
}
.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}
.tab-btn:hover {
  border-color: #0099ff;
  color: #0099ff;
}
.tab-btn.active {
  background: #0099ff;
  color: #ffffff;
  border-color: #0099ff;
  box-shadow: 0 2px 8px rgba(0, 153, 255, 0.35);
}

/* 1:1 QQ 聊天外层舞台 */
.qq-chat-stage {
  width: 100%;
  max-width: 580px;
  padding: 24px 20px;
  border-radius: 16px;
  background: #eef5fe;
  border: 1px solid #d9e6f7;
  box-shadow: 0 4px 20px rgba(0, 100, 255, 0.05);
  transition: background 0.3s ease, border-color 0.3s ease;
}

/* 深色模式适配 */
:root.dark .qq-chat-stage {
  background: #23272e;
  border-color: #31363f;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.qq-message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

/* Bot 头像 */
.qq-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.qq-message-content {
  flex: 1;
  min-width: 0;
}

/* 头部昵称与认证标识 */
.qq-bot-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.qq-bot-name {
  font-size: 13px;
  color: #1f2328;
  font-weight: 500;
}
:root.dark .qq-bot-name {
  color: #c9d1d9;
}
.qq-bot-badge {
  display: inline-flex;
  align-items: center;
  color: #0099ff;
}
.badge-icon {
  width: 14px;
  height: 14px;
}

/* 消息气泡主卡片 */
.qq-bubble-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  color: #1f2328;
  font-size: 14px;
  line-height: 1.6;
}
:root.dark .qq-bubble-card {
  background: #1b1e22;
  color: #e6edf3;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 气泡内部 Markdown 元素 */
:deep(.qq-h1) {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  color: inherit;
}
:deep(.qq-blockquote) {
  margin: 8px 0;
  padding: 2px 0 2px 10px;
  border-left: 3px solid #d0d7de;
  color: #57606a;
  background: transparent;
}
:root.dark :deep(.qq-blockquote) {
  border-left-color: #3e4451;
  color: #8b949e;
}
:deep(.qq-quote-line), :deep(.qq-p) {
  margin: 4px 0;
  font-size: 13.5px;
}
:deep(.qq-quote-line) {
  color: #57606a;
}
:root.dark :deep(.qq-quote-line) {
  color: #8b949e;
}
:deep(.qq-divider) {
  color: #a0aec0;
  font-size: 12px;
}
:deep(em) {
  font-style: normal;
  font-size: 12px;
  color: #64748b;
  display: inline;
}
:root.dark :deep(em) {
  color: #94a3b8;
}

/* 蓝字指令交互样式 */
:deep(.qq-cmd-input) {
  color: #0099ff;
  cursor: pointer;
  font-weight: 500;
  display: inline-block;
  padding: 0 2px;
  border-radius: 4px;
  transition: all 0.15s ease;
}
:root.dark :deep(.qq-cmd-input) {
  color: #38bdf8;
}
:deep(.qq-cmd-input:hover) {
  text-decoration: underline;
  background: rgba(0, 153, 255, 0.1);
}

/* 气泡内嵌图片 */
:deep(.qq-img-box) {
  margin: 12px 0 6px 0;
  display: flex;
  justify-content: flex-start;
}
:deep(.qq-body-img) {
  max-width: 240px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 底部交互键盘 (Keyboard) */
.qq-keyboard {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
:root.dark .qq-keyboard {
  border-top-color: #2d333b;
}
.keyboard-row {
  display: flex;
  gap: 8px;
}
.keyboard-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: #f7fafc;
  color: #2d3748;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keyboard-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}
:root.dark .keyboard-btn {
  background: #22272e;
  color: #adbac7;
  border-color: #373e47;
}
:root.dark .keyboard-btn:hover {
  background: #2d333b;
  color: #cdd9e5;
  border-color: #444c56;
}
.btn-link-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 5px;
  color: #0099ff;
}
:root.dark .btn-link-icon {
  color: #38bdf8;
}
.link-svg {
  width: 13px;
  height: 13px;
}

/* 轻量 Toast 提示 */
.qq-toast {
  position: absolute;
  top: 60px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  border-radius: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 50;
}
:root.dark .qq-toast {
  background: rgba(255, 255, 255, 0.9);
  color: #000000;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
