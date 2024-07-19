import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent {
  selectedTab: string = 'canvas';

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }

  centerNodePosition: { x: number, y: number } = { x: 0, y: 0 };

  onCenterNode(position: { x: number, y: number }) {
    this.centerNodePosition = position;
  }
}
