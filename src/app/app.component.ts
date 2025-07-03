import { Component } from '@angular/core';
import { BoardComponent } from './component/board/board.component';

@Component({
  selector: 'app-root',
  imports: [BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'blocknode';
}
