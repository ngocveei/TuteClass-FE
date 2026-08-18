import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr'
import { env } from '@/config/env.config'
import { getAccessToken } from '@/services/auth/tokenStorage'

export function createSignalRConnection(hubName: string) {
  const normalizedHubName = hubName.replace(/^\//, '')

  return new HubConnectionBuilder()
    .withUrl(`${env.signalRUrl}/${normalizedHubName}`, {
      accessTokenFactory: () => getAccessToken() ?? '',
      transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build()
}
