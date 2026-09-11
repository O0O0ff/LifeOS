/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-11 23:14:28
 * @LastEditTime: 2026-09-12 01:10:00
 * @FilePath: \life-os-shadcn\commitlint.config.cjs
 */
const fs = require('fs')
const path = require('path')

// 自动扫描 apps 和 packages 目录下的子项目作为合法 scope
function getWorkspaceScopes() {
  const scopes = new Set(['root', 'deps', 'release', 'workflow', 'config'])

  try {
    // 扫描 apps 目录
    const appsDir = path.resolve(__dirname, 'apps')
    if (fs.existsSync(appsDir)) {
      fs.readdirSync(appsDir, { withFileTypes: true }).forEach((dirent) => {
        if (dirent.isDirectory()) scopes.add(dirent.name)
      })
    }

    // 扫描 packages 目录
    const packagesDir = path.resolve(__dirname, 'packages')
    if (fs.existsSync(packagesDir)) {
      fs.readdirSync(packagesDir, { withFileTypes: true }).forEach((dirent) => {
        if (dirent.isDirectory()) scopes.add(dirent.name)
      })
    }
  } catch (e) {
    console.warn('自动扫描 Workspace Scope 失败，将使用默认兜底配置', e)
  }

  return Array.from(scopes)
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 0 表示关闭，2 表示错误。这里用动态函数返回数组
    'scope-enum': [2, 'always', getWorkspaceScopes()],
  },
}
