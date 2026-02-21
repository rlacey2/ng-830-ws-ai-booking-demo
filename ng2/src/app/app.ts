 
import { RouterOutlet } from '@angular/router';

import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { WebSocketService } from './booking/websocket.service';
import { HttpClient } from '@angular/common/http';

  
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit {
 
  protected readonly title = signal('Websocket Seat Booking');
 
  // signals
  state = computed(() => this.ws.seatState());
  seatsRemaining = computed(() => this.state()?.seatsRemaining ?? 0);
  isSoldOut = computed(() => this.state()?.soldOut ?? true);
  isLoaded = computed(() => this.state() !== null);

 
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
