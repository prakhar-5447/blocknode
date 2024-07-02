import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  selectedTabIndex: number = 0;

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
}
