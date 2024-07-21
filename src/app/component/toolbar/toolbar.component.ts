import { AppState } from '@/app/store/node.state';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as NodeSelectors from '../../store/node.selectors';
import { Connection } from '@/app/models/connection.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {
  selectedConnection: Connection | null = null;
  constructor(private store: Store<{ appState: AppState }>) {
    this.store.pipe(select(NodeSelectors.selectSelectedConnection)).subscribe(conn => {
      this.selectedConnection = conn;
    });
  }
}
