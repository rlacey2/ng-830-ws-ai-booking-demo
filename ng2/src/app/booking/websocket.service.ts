
import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface SeatState {
  eventId: string;
  seatsRemaining: number;
  soldOut?: boolean;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket;
  seatState = signal<SeatState | null>(null);
  private currentEventId: string | null = null;

  constructor() {
    this.socket = io('http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('connect')
      if (this.currentEventId) {
        this.joinEvent(this.currentEventId);
      }
    });

    this.socket.on('seatStatus', (data: SeatState) => {
      console.log('seatStatus')
      this.seatState.set(data);
    });

    this.socket.on('seatUpdate', (data: SeatState) => {
      console.log('seatUpdate')
      this.seatState.set(data);
    });
  }

  joinEvent(eventId: string) {
    console.log('joinEvent')
    this.currentEventId = eventId;
    this.socket.emit('joinEvent', eventId);
  }

  leaveEvent(eventId: string) {
    console.log('leaveEvent')
    this.socket.emit('leaveEvent', eventId);
  }
}
