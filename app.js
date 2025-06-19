const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.render('index', { onlineCount });
});

// --- SIMPLE MATCHMAKING AND ONLINE COUNTER ---
let onlineCount = 0;
const queues = { coop: [], versus: [] };

io.on('connection', socket => {
  onlineCount++;
  io.emit('onlineCount', onlineCount);
  console.log('Cliente conectado');

  socket.on('findMatch', ({ mode }) => {
    if (!queues[mode]) return;
    socket.matchMode = mode;
    queues[mode].push(socket);

    if (queues[mode].length >= 2) {
      const [p1, p2] = queues[mode].splice(0, 2);
      const room = `room-${mode}-${Date.now()}-${Math.floor(Math.random()*10000)}`;
      p1.join(room);
      p2.join(room);
      p1.emit('matchFound', { room, player: 1, mode });
      p2.emit('matchFound', { room, player: 2, mode });
    }
  });

  socket.on('cancelMatch', () => {
    const mode = socket.matchMode;
    if (mode && queues[mode]) {
      const idx = queues[mode].indexOf(socket);
      if (idx !== -1) queues[mode].splice(idx, 1);
    }
    socket.matchMode = null;
  });

  socket.on('disconnect', () => {
    onlineCount--;
    io.emit('onlineCount', onlineCount);

    const mode = socket.matchMode;
    if (mode && queues[mode]) {
      const idx = queues[mode].indexOf(socket);
      if (idx !== -1) queues[mode].splice(idx, 1);
    }
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
