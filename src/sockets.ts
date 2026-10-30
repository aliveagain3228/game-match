import { io } from 'socket.io-client'

export const socket = io('https://gamematch-backend-9y1r.onrender.com', {
    autoConnect: false,
})