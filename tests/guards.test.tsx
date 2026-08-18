import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { GuestGuard } from '@/shared/auth/GuestGuard'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { ROLES } from '@/shared/constants/roles'
import { setTokens } from '@/services/auth/tokenStorage'

function token(claims: object) {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${encode({ alg: 'none' })}.${encode(claims)}.`
}

function authenticate(role: string) {
  setTokens({
    accessToken: token({ role, exp: Math.floor(Date.now() / 1000) + 3600 }),
    refreshToken: 'refresh',
    accessTokenExpiresAt: '2030-01-01T00:00:00Z',
    refreshTokenExpiresAt: '2030-02-01T00:00:00Z',
  })
}

describe('route guards', () => {
  it('redirects unauthenticated users to login', () => {
    render(<MemoryRouter initialEntries={['/classes']}><Routes><Route path="/classes" element={<RoleGuard allowedRoles={[ROLES.teacher]}><div>Teacher</div></RoleGuard>} /><Route path="/login" element={<div>Login</div>} /></Routes></MemoryRouter>)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('allows the matching role and rejects another role', () => {
    authenticate(ROLES.teacher)
    const { unmount } = render(<MemoryRouter initialEntries={['/classes']}><Routes><Route path="/classes" element={<RoleGuard allowedRoles={[ROLES.teacher]}><div>Teacher</div></RoleGuard>} /></Routes></MemoryRouter>)
    expect(screen.getByText('Teacher')).toBeInTheDocument()
    unmount()

    authenticate(ROLES.student)
    render(<MemoryRouter initialEntries={['/classes']}><Routes><Route path="/classes" element={<RoleGuard allowedRoles={[ROLES.teacher]}><div>Teacher</div></RoleGuard>} /><Route path="/forbidden" element={<div>Forbidden</div>} /></Routes></MemoryRouter>)
    expect(screen.getByText('Forbidden')).toBeInTheDocument()
  })

  it('keeps signed-in teachers out of guest-only auth pages', () => {
    authenticate(ROLES.teacher)
    render(<MemoryRouter initialEntries={['/login']}><Routes><Route path="/login" element={<GuestGuard><div>Login</div></GuestGuard>} /><Route path="/classes" element={<div>Classes</div>} /></Routes></MemoryRouter>)
    expect(screen.getByText('Classes')).toBeInTheDocument()
  })
})
