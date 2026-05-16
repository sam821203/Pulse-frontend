import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  auth: {
    token: null
  }
})

export interface StockSocketPayload {
  lastTradeDate: string
  lastTradeTime: string
  openingPrice: string | number
  highestPrice: string | number
  lowestPrice: string | number
  previousClose: string | number
  currentPrice: string | number
  currentVolume: string | number
}

export function subscribeStock(
  stockId: string,
  callback: (data: StockSocketPayload) => void
): () => void {
  socket.emit('subscribeStock', { stockId })

  const handler = (data: StockSocketPayload) => callback(data)
  socket.on(`stockData:${stockId}`, handler)

  return () => {
    socket.off(`stockData:${stockId}`, handler)
  }
}
