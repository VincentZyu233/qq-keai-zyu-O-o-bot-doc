import DefaultTheme from 'vitepress/theme'
import QQBotMessage from './components/QQBotMessage.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('QQBotMessage', QQBotMessage)
  }
}
