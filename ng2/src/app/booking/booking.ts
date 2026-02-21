  
import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'booking',
  templateUrl: './booking.html',
})

export class BookingComponent  implements OnInit {
 
  protected readonly title = signal('Websocket Seat Booking');
 
  // signals
  state = computed(() => this.ws.seatState());
  seatsRemaining = computed(() => this.state()?.seatsRemaining ?? 0);
  isSoldOut = computed(() => this.state()?.soldOut ?? true);
  isLoaded = computed(() => this.state() !== null);

  isOneLeft = computed(() => this.state()?.seatsRemaining === 1  );

 
  ws = inject(WebSocketService)
  http = inject(HttpClient)
  constructor(  ) {}

  ngOnInit() {
    this.ws.joinEvent('event1');
  }

  book() {
    this.http.post('http://localhost:4000/book/event1', {}).subscribe();
  }

}
