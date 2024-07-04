import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent {
  selectedTab: string = 'canvas';
  nodes = [{ id: 1, name: 'Node 1' },
  { id: 2, name: 'Node 2' },
  { id: 3, name: 'Node 3' }];

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }
}
