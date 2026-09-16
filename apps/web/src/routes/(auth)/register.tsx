/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 18:42:39
 * @LastEditTime: 2026-09-16 20:29:38
 * @FilePath: \life-os\apps\web\src\routes\(auth)\register.tsx
 */
import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

// shadcn UI 组件导入
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  // 表单状态
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 提交注册表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // 简单校验
    if (password !== confirmPassword) {
      setErrorMsg('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      // 调用 auth-client 的注册方法
      // 注意：请确保你的 authClient 有 signUp 相关的方法暴露
      const res = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (res?.error) {
        setErrorMsg(res.error.message || '注册失败，请检查输入的信息')
        return
      }

      // 注册成功后跳转到首页 (或者根据业务需求跳转到 /login)
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Registration failed:', error)
      setErrorMsg(error?.message || '注册时发生意外错误，请稍后再试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            创建账号
          </CardTitle>
          <CardDescription>填写以下信息以注册您的 Life OS 账号</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {/* 错误信息提示 */}
            {errorMsg && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            {/* 昵称输入框 */}
            <div className="grid gap-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                type="text"
                placeholder="张三"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* 邮箱输入框 */}
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* 密码输入框 */}
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* 确认密码输入框 */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '注册中...' : '注册'}
            </Button>

            {/* 去登录的引导 */}
            <div className="text-center text-sm text-muted-foreground">
              已有账号？ {/* 这里使用 TanStack Router 的 Link 组件，体验更好 */}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                返回登录
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
