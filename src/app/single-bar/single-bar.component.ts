import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SingleBarConf } from '../models/single-bar.model';

@Component({
  selector: 'app-single-bar',
  templateUrl: './single-bar.component.html',
  styleUrls: ['./single-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleBarComponent {

  @Input() height: number;
  @Input() width: number;

  @Input() conf: SingleBarConf;

}
