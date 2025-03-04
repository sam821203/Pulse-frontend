import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  transports: ['websocket'], // 強制使用 WebSocket
  auth: {
    token: null // 不傳任何 token
  }
})

export function subscribeStock(stockId, callback) {
  socket.emit('subscribeStock', { stockId })

  socket.on(`stockData:${stockId}`, (data) => {
    callback(data)
  })
}
