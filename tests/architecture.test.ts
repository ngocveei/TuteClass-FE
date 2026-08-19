// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const sourceRoot = join(root, 'src')

function sourceFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : ['.ts', '.tsx'].includes(extname(path)) ? [path] : []
  })
}

const normalized = (path: string) => relative(root, path).split(sep).join('/')

describe('READMEv1 architecture boundaries', () => {
  it('keeps endpoint literals inside feature api folders', () => {
    const violations = sourceFiles(join(sourceRoot, 'features')).flatMap((path) => {
      if (normalized(path).includes('/api/')) return []
      return /["'`]\/api\//.test(readFileSync(path, 'utf8')) ? [normalized(path)] : []
    })
    expect(violations).toEqual([])
  })

  it('does not let pages or presentation components import feature API modules', () => {
    const violations = sourceFiles(join(sourceRoot, 'features')).flatMap((path) => {
      const name = normalized(path)
      if (!name.includes('/pages/') && !name.includes('/components/')) return []
      return /features\/[^/]+\/api\//.test(readFileSync(path, 'utf8')) ? [name] : []
    })
    expect(violations).toEqual([])
  })

  it('has no migration suffixes or legacy nested class domains', () => {
    const forbiddenSuffix = /(?:Old|New|V2|Final|Temp)\.(?:ts|tsx)$/i
    const violations = sourceFiles().map(normalized).filter((path) => forbiddenSuffix.test(path))
    expect(violations).toEqual([])
    expect(sourceFiles(join(sourceRoot, 'features', 'classes')).map(normalized).filter((path) => /\/(?:teacher-overview|teacher-classes|teacher-students|class-settings|class-approvals)\//.test(path))).toEqual([])
  })

  it('declares every route page through lazy.pages', () => {
    const lazySource = readFileSync(join(sourceRoot, 'app', 'router', 'lazy.pages.ts'), 'utf8')
    const pageFiles = sourceFiles(join(sourceRoot, 'features')).filter((path) => normalized(path).includes('/pages/'))
    const missing = pageFiles.map(normalized).filter((path) => {
      const modulePath = path.replace(/^src\//, '@/').replace(/\.tsx$/, '')
      return !lazySource.includes(`import('${modulePath}')`)
    })
    expect(missing).toEqual([])
  })

  it('uses public contracts for cross-feature imports', () => {
    const violations = sourceFiles(join(sourceRoot, 'features')).flatMap((path) => {
      const name = normalized(path)
      const owner = name.match(/^src\/features\/([^/]+)\//)?.[1]
      const imports = [...readFileSync(path, 'utf8').matchAll(/@\/features\/([^/'"]+)\/[^'"]+/g)]
      return imports.some((match) => match[1] !== owner) ? [name] : []
    })
    expect(violations).toEqual([])
  })

  it('keeps the agreed classes domain component structure', () => {
    const required = [
      'components/class-list/ClassCard.tsx',
      'components/class-list/ClassList.tsx',
      'components/settings/ClassSettingsForm.tsx',
      'components/settings/ClassGeneralSettings.tsx',
      'components/settings/ClassDangerZone.tsx',
      'components/approvals/JoinRequestCard.tsx',
      'components/approvals/JoinRequestList.tsx',
      'components/students/StudentTable.tsx',
      'components/students/StudentCard.tsx',
      'services/classMapper.ts',
      'utils/class.utils.ts',
    ]
    const missing = required.filter((path) => (
      !existsSync(join(sourceRoot, 'features', 'classes', ...path.split('/')))
    ))
    expect(missing).toEqual([])
  })

  it('does not ship migration mock or demo implementations', () => {
    const migratedDomains = ['auth', 'classes', 'profile', 'notifications', 'tuition']
    const violations = migratedDomains.flatMap((domain) => (
      sourceFiles(join(sourceRoot, 'features', domain)).flatMap((path) => (
        /\b(?:mock|fake)\b|demo(?:Data|Card|Label)/i.test(readFileSync(path, 'utf8'))
          ? [normalized(path)]
          : []
      ))
    ))
    expect(violations).toEqual([])
  })
})
