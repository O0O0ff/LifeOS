/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-14 00:25:58
 * @LastEditTime: 2026-09-16 20:27:50
 * @FilePath: \life-os\apps\web\src\routes\(auth)\login.tsx
 */
import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { signIn } from '@/lib/auth-client'

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

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  // 表单状态
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 提交登录表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      // 注意：根据你的 authClient 的实际底层库（大概率是 better-auth 等）
      // 这里的方法可能需要调整，常见的是 signIn.email({ email, password })
      const res = await signIn.email({
        email,
        password,
      })

      // 如果返回错误（通常在 better-auth 中，如果不出异常，会在返回值里带 error）
      if (res?.error) {
        setErrorMsg(res.error.message || '邮箱或密码错误')
        return
      }

      // 登录成功后跳转到首页或主控制台
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Login failed:', error)
      setErrorMsg(error?.message || '登录时发生意外错误，请稍后再试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // 使用 TailwindCSS 使登录框在页面中绝对居中
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            欢迎回来
          </CardTitle>
          <CardDescription>请输入您的邮箱和密码以登录 Life OS</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {/* 错误信息提示 */}
            {errorMsg && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                {/* 如果你有忘记密码页面，可以替换这里的 href 或是用 Link 组件 */}
                <a
                  href="#"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  忘记密码？
                </a>
              </div>
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>

            {/* 去注册的引导 */}
            <div className="text-center text-sm text-muted-foreground">
              还没有账号？{' '}
              <a
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ to: '/register' as any }) // 根据你实际的路由调整
                }}
              >
                立即注册
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
