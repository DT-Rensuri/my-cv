import { hc } from 'hono/client'

import { authedFetch } from '../libs/auth-fetch'
import { SERVER_URL } from '../libs/server'

export const client = hc(SERVER_URL, {
  fetch: authedFetch,
})

export type StageApiClient = typeof client