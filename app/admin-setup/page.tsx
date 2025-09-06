'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('admin@playpro.com')
  const [password, setPassword] = useState('admin123')
  const [name, setName] = useState('Admin User')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuthStore()

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ ${data.message}`)
        
        // Try to sign in with the admin credentials
        setTimeout(async () => {
          try {
            await login(email, password)
            setMessage('✅ Admin setup complete! Redirecting to admin panel...')
            setTimeout(() => {
              router.push('/admin')
            }, 2000)
          } catch (signInError) {
            setError('Admin created but auto-login failed. Please try logging in manually.')
          }
        }, 1000)
      } else {
        setError(`❌ ${data.message}`)
        if (data.instructions) {
          setError(prev => {
            let errorMsg = prev + '\n\n📋 Instructions to fix this:'
            data.instructions.forEach((instruction: string) => {
              errorMsg += `\n${instruction}`
            })
            if (data.alternativeStep) {
              errorMsg += `\n\n💡 Alternative: ${data.alternativeStep}`
            }
            return errorMsg
          })
        }
        if (data.suggestion) {
          setError(prev => `${prev}\n💡 ${data.suggestion}`)
        }
      }
    } catch (err) {
      setError('Failed to setup admin. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await login(email, password)
      setMessage('✅ Login successful! Redirecting to admin panel...')
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (err) {
      setError('❌ Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const checkExistingAdmins = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/setup-admin')
      const data = await response.json()

      if (data.success) {
        if (data.hasAdmin) {
          setMessage(`Found ${data.admins.length} admin user(s):`)
          data.admins.forEach((admin: any, index: number) => {
            setMessage(prev => `${prev}\n${index + 1}. ${admin.email} (${admin.name})`)
          })
        } else {
          setMessage('No admin users found in database.')
        }
      } else {
        setError('Failed to check existing admins.')
      }
    } catch (err) {
      setError('Failed to check existing admins.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up your admin credentials for PlayPro2
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSetupAdmin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Setup Admin Account'}
            </button>

            <button
              type="button"
              onClick={handleTestLogin}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>

            <button
              type="button"
              onClick={checkExistingAdmins}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Existing Admins'}
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <pre className="text-sm text-green-700 whitespace-pre-wrap">{message}</pre>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Instructions
              </span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>1. Enter your desired admin credentials above</p>
            <p>2. Click "Setup Admin Account" to create the admin user</p>
            <p>3. Use "Test Login" to verify the credentials work</p>
            <p>4. Once setup, you can login at the main login page</p>
          </div>
        </div>
      </div>
    </div>
  )
}