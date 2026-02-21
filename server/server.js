

const portNo = 4000

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ---- Fake DB ----
const events = {
  event1: { seatsRemaining: 5 }
};


/**
 * @param {string} eventId
 */
function bookingData(eventId) {

  // business logic here to generate the ws message/data object to be consumed on the client

  // @ts-ignore
  const event = events[eventId];
  return {
    eventId,
    seatsRemaining: event.seatsRemaining,
    soldOut: event.seatsRemaining === 0,
  //  oneLeft: event.seatsRemaining === 1 client side logic
  }

}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinEvent', (eventId) => {
  socket.join(`event-${eventId}`);
// @ts-ignore
    const event = events[eventId];
    if (event) {
      let data = bookingData(eventId)
      socket.emit('seatStatus', data);
    }
  });

  socket.on('leaveEvent', (eventId) => {
    console.log('leaveEvent');
    socket.leave(`event-${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.post('/book/:eventId', (req, res) => {
  console.log('/book/:eventId')
  const { eventId } = req.params;
  // @ts-ignore
  const event = events[eventId];

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (event.seatsRemaining <= 0) {
    return res.status(400).json({ error: 'Sold out' });
  }

  event.seatsRemaining--;
  let data = bookingData(eventId)
  io.to(`event-${eventId}`).emit('seatUpdate',  data);

  res.json({ success: true });
});

server.listen(portNo, () => {
  console.log('Server running on port: ' + portNo);
});
