import { Component, OnInit } from '@angular/core';
import { SingleBarConf } from './models/single-bar.model';
import { interval, Subscription } from 'rxjs';

import { DEFAULT_DATA } from './data/default';
import { GENERATED_DATA } from './data/generated';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // you have to set
  data: { [key: string]: SingleBarConf[] } = DEFAULT_DATA; // replace with GENERATED_DATA

  // you can change
  barsNumber = 4;
  height = 32;
  intervalDuration = 1000;

  // do not touch
  time = 0;
  interval: Subscription;

  ngOnInit() {
  }

  start() {
    const timeEnd = Object.values(this.data)[0].length;

    this.interval = interval(this.intervalDuration).subscribe(() => {
      if (this.time === timeEnd - 1) {
        this.interval.unsubscribe();
        return;
      }

      this.time += 1;
    });
  }

  restart() {
    this.pause();
    this.time = 0;
    this.start();
  }

  pause() {
    if (this.interval) {
      this.interval.unsubscribe();
    }

    this.interval = null;
  }

  trackByFn(i, o) {
    return o.label;
  }
    
}