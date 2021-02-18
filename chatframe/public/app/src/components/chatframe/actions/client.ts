import { Client } from '../conversationClient'

export let client
export let clientName
export const createClient = clientOptions => {
    client = new Client(clientOptions)
    clientName = 'dialogflow'
}
