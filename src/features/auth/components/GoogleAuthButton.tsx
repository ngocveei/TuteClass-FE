import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '@/features/auth/api/auth.api'
import type { RegistrationRole } from '@/features/auth/types/auth.types'
import { loadGoogleIdentity } from '@/features/auth/services/googleIdentityService'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import { ROUTES } from '@/shared/constants/routes'

export function GoogleAuthButton({ mode, role, disabled, onError }: { mode: 'login' | 'register'; role: RegistrationRole; disabled?: boolean; onError(message: string): void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const roleRef = useRef(role)
  roleRef.current = role

  useEffect(() => {
    if (disabled) { setLoading(false); return }
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
    if (!clientId) { setLoading(false); return }
    let active = true
    loadGoogleIdentity().then((api) => {
      if (!active || !containerRef.current) return
      api.initialize({ client_id: clientId, callback: ({ credential }) => {
        if (!credential) { onError('Google không trả về ID token hợp lệ.'); return }
        void googleLogin(credential, roleRef.current).then((result) => {
          const home: Record<string, string> = { Teacher: ROUTES.teacherClasses, Student: ROUTES.studentClasses, Admin: ROUTES.adminUsers }
          navigate(home[result.user.roleName] || '/', { replace: true })
        }).catch((reason) => onError(getApiErrorMessage(reason)))
      } })
      containerRef.current.replaceChildren()
      api.renderButton(containerRef.current, { theme: 'outline', size: 'large', type: 'standard', shape: 'rectangular', text: mode === 'register' ? 'signup_with' : 'signin_with', width: containerRef.current.offsetWidth || 360, locale: 'vi' })
      setLoading(false)
    }).catch((reason) => { if (active) { setLoading(false); onError(getApiErrorMessage(reason)) } })
    return () => { active = false }
  }, [disabled, mode, navigate, onError])

  const clientIdMissing = !import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
  if (disabled || clientIdMissing) return <button type="button" className="google-fallback" disabled title={clientIdMissing ? 'Google chưa được cấu hình cho bản build này.' : undefined}><GoogleMark />{mode === 'register' ? 'Đăng ký với Google' : 'Đăng nhập bằng Google'}</button>
  return <div className="google-button-wrap"><div ref={containerRef} />{loading && <button type="button" className="google-fallback" disabled><GoogleMark />Đang tải Google...</button>}</div>
}

function GoogleMark() { return <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06z"/></svg> }
