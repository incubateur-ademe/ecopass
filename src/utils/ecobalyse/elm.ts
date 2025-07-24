//@ts-expect-error ELM file
import { Elm } from "./server-app.js"
import { readFileSync } from "fs"
import { v4 as uuid } from "uuid"

const elmApp = Elm.Server.init()

const pendingRequests = new Map<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value: any) => void
    reject: (reason: Error) => void
    timeout: NodeJS.Timeout
  }
>()

const processes = readFileSync("./src/utils/ecobalyse/processes_impacts.json", "utf-8")

elmApp.ports.output.subscribe(
  (response: {
    status: number
    method: string
    url: string
    body: Record<string, unknown>
    jsResponseHandler: (response: { status: number; body: Record<string, unknown> }) => void
  }) => {
    const url = new URL(response.url, process.env.NEXTAUTH_URL)
    const requestId = url.searchParams.get("requestId")

    if (requestId && pendingRequests.has(requestId)) {
      const { resolve, reject, timeout } = pendingRequests.get(requestId)!
      clearTimeout(timeout)
      pendingRequests.delete(requestId)

      if (response.status >= 200 && response.status < 300) {
        resolve(response.body)
      } else {
        reject(new Error(`HTTP ${response.status}: ${JSON.stringify(response.body)}`))
      }
    }
  },
)

export const runElmFunction = async <T>(request: {
  method: string
  url: string
  body?: Record<string, unknown>
  processes?: string
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    const requestId = uuid()

    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId)
      reject(new Error(`Timeout: La requête ${requestId} n'a pas reçu de réponse dans les 30 secondes`))
    }, 30000)

    pendingRequests.set(requestId, { resolve, reject, timeout })

    try {
      elmApp.ports.input.send({
        method: request.method,
        url: `${request.url}?requestId=${requestId}`,
        body: request.body || {},
        processes,
        jsResponseHandler: () => {},
      })
    } catch (error) {
      clearTimeout(timeout)
      pendingRequests.delete(requestId)
      reject(new Error(`Erreur lors de l'envoi de la requête: ${error}`))
    }
  })
}
