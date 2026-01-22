// src/config/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_APP_KEY || 'your_pusher_key',
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'ap1',
    forceTLS: true,
    encrypted: true,
    wsHost: window.location.hostname,
    wsPort: 6001, // Port của Laravel Websockets
    disableStats: true,
    enabledTransports: ['ws', 'wss']
});

export default echo;