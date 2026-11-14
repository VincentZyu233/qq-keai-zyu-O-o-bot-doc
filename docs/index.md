---
layout: home

hero:
  name: "可爱zyu的bot"
  text: "QQ 官方机器人 · 全量 Markdown 互动"
  tagline: "一个集游戏辅助、生活行情、实用工具、趣味互动于一身的可爱 Bot"
  image:
    src: /images/bot-avatar-v2.png
    alt: 可爱zyu的bot
  actions:
    - theme: brand
      text: 🐧 一键拉 Bot 进群
      link: https://bot.q.qq.com/s/wItKEI8kSs
    - theme: alt
      text: 📱 交互菜单演示
      link: /menus
    - theme: alt
      text: 📖 免艾特设置指南
      link: /guide

features:
  - icon: 🎮
    title: Steam & CS2 综合互联
    details: 支持绑定 Steam 账号、查看个人状态卡、近两周游玩、热销榜，以及 CS2 个人战绩与库存直查。
  - icon: 📈
    title: 招行实时金价与多源资讯
    details: 接入招商银行权威行情报价，支持实时买卖价差与走势图；集成 60s 每日早报、多平台热搜与漫展活动查询。
  - icon: 🕊️
    title: 光遇与 Minecraft 垂直生态
    details: 支持光遇每日任务、祈福抽签、Sky Shards 碎片喷发预报；MC 皮肤渲染、服务器状态与 OpenBMCLAPI 监控。
  - icon: 💬
    title: 1:1 官方 Markdown 按钮交互
    details: 全量适配 QQ 官方机器人 Markdown 蓝字指令输入与交互式底栏键盘，轻点即玩，零风控隐患。
---

<div class="hero-badges-wrapper">
  <div class="hero-avatar-box">
    <img src="/images/bot-avatar-v2.png" alt="当前正式头像" class="hero-avatar-img" />
    <span class="hero-avatar-label">✨ 当前正式头像</span>
  </div>
  <div class="hero-avatar-box">
    <img src="/images/bot-avatar-v1.png" alt="早期版本头像" class="hero-avatar-img legacy" />
    <span class="hero-avatar-label">📦 早期纪念头像</span>
  </div>
</div>

<div style="text-align: center; margin: 3rem 0 1rem 0;">
  <h2>📱 真实客户端效果演示（1:1 像素级交互）</h2>
  <p style="color: var(--vp-c-text-2);">下方为网页端 1:1 模拟的手机 QQ 聊天气泡，点击任意蓝字可体验指令复制：</p>
</div>

<QQBotMessage initialMenu="cs2菜单" :showTabs="false" />

<div style="text-align: center; margin: 3rem 0 2rem 0;">
  <h2>📲 手机扫码直达</h2>
  <p style="color: var(--vp-c-text-2); margin-bottom: 1rem;">群主或管理员使用手机 QQ 扫描下方二维码，即可直接将 Bot 添加至群聊：</p>
  <img src="/images/qrcode-bot-invite.png" alt="拉群二维码" style="width: 180px; border-radius: 12px; margin: 0 auto; box-shadow: 0 4px 16px rgba(0,0,0,0.12);" />
  <div style="margin-top: 1rem;">
    <a href="https://bot.q.qq.com/s/wItKEI8kSs" target="_blank" class="vp-button medium brand" style="display: inline-block; padding: 6px 18px; border-radius: 20px; background: #0099ff; color: #fff; text-decoration: none; font-weight: 500;">
      🔗 点击在手机 QQ 中直接打开加群链接
    </a>
  </div>
</div>
