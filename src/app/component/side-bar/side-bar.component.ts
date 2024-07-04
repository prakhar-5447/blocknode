import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  @Input() nodes: { name: string, id: number }[] = [];
  @Output() tabSelected = new EventEmitter<string>();

  selectTab(tabName: string): void {
    this.tabSelected.emit(tabName);
  }
}
