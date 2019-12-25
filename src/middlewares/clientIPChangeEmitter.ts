import { AxiosResponse } from 'axios'
import PutioAPIClient from '..'
import {
  IPutioAPIClientMiddlewareFactory,
  PutioAPIClientEventTypes,
} from '../types'

const createClientIPChangeEmitterMiddleware: IPutioAPIClientMiddlewareFactory = (
  client: PutioAPIClient,
) => {
  let IP: string = ''

  const checkIP = (response: AxiosResponse) => {
    const newIP = response.headers['putio-client-ip']

    if (!IP) {
      IP = newIP
      return
    }

    if (IP !== newIP) {
      client.emit(PutioAPIClientEventTypes.CLIENT_IP_CHANGED, { IP, newIP })
      return
    }
  }

  return {
    onFulfilled: response => {
      checkIP(response)
      return response
    },

    onRejected: error => {
      if (error.response) {
        checkIP(error.response)
      }

      return Promise.reject(error)
    },
  }
}

export default createClientIPChangeEmitterMiddleware
