# Minecraft 皮肤查看器

这是一个基于 [mc-skinviewer](https://github.com/daidr/mc-skinviewer) 开发的 Minecraft 皮肤查看器，允许您查看、上传和预览 Minecraft 的皮肤。

## 功能特点

- 支持预览 Steve 和 Alex 模型皮肤
- 支持本地上传皮肤图片文件
- 支持通过 URL 加载皮肤
- 支持通过 Minecraft 用户名获取皮肤
- 提供多种动画效果：360° 旋转、行走、跑步
- 支持鼠标拖动旋转皮肤查看不同角度

## 如何使用

1. 下载或克隆此仓库到本地
2. 在浏览器中打开 `index.html` 文件
3. 使用以下任意方式加载皮肤：
   - 上传本地 PNG 格式的皮肤文件
   - 输入皮肤图片的 URL 并点击"加载 URL"
   - 输入 Minecraft 用户名并点击"加载用户皮肤"
4. 使用界面下方的按钮控制动画：
   - 旋转：360° 旋转皮肤
   - 行走：播放行走动画
   - 跑步：播放跑步动画
   - 重置：停止所有动画并重置视角
5. 如果没有播放动画，可以直接用鼠标拖动皮肤来旋转视角

## 技术说明

- 本项目使用纯 HTML/CSS/JavaScript 开发，不依赖任何外部框架
- 皮肤渲染基于 CSS 3D 变换实现，不使用 WebGL 或 Canvas
- 通过 Mojang API 获取玩家皮肤信息

## 声明

本项目基于 [mc-skinviewer](https://github.com/daidr/mc-skinviewer) 开发，遵循 MIT 许可证。

Minecraft 是 Mojang Studios 的商标，本项目与 Mojang 和 Microsoft 没有任何关联。 