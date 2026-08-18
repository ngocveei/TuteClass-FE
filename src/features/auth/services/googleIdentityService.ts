export interface GoogleCredentialResponse { credential?: string }
interface GoogleIdApi {
  initialize(options: { client_id: string; callback(response: GoogleCredentialResponse): void }): void
  renderButton(parent: HTMLElement, options: Record<string, string | number>): void
}
declare global { interface Window { google?: { accounts: { id: GoogleIdApi } } } }

let sdkPromise: Promise<GoogleIdApi> | undefined
export function loadGoogleIdentity(): Promise<GoogleIdApi> {
  if (window.google?.accounts.id) return Promise.resolve(window.google.accounts.id)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity]')
    const complete = () => window.google?.accounts.id ? resolve(window.google.accounts.id) : reject(new Error('Google Identity không khả dụng.'))
    if (existing) { existing.addEventListener('load', complete, { once: true }); return }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.dataset.googleIdentity = 'true'
    script.addEventListener('load', complete, { once: true }); script.addEventListener('error', () => reject(new Error('Không thể tải Google Identity.')), { once: true })
    document.head.appendChild(script)
  })
  return sdkPromise
}
