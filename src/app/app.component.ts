import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SingleBarConf } from './models/single-bar.model';
import { interval, Subscription } from 'rxjs';

import { generator } from './data/generator';

import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // you have to set
  data: {
    [key: string]: {
      label: string,
      color: string,
      timeserie: SingleBarConf[]
    }
  };

  // you can change
  barsNumber = 40;
  height = 32;
  intervalDuration = 1200;

  // do not touch
  time = 0;
  interval: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/src.tsv', { responseType: 'text' })
      .pipe(
        map(generator),
        tap(console.log),
      )
      .subscribe(data => {
        this.data = data;
      });
  }

  start() {
    const timeEnd = Object.values(this.data)[0].timeserie.length;

    this.interval = interval(this.intervalDuration).subscribe(() => {
      if (this.time === timeEnd - 2) {
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