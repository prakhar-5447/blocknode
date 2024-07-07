import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/store/node.state';
import * as NodeSelectors from '../../store/node.selectors';
import * as NodeActions from '../../store/node.actions';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent {
  code: string = '';
  id: string = "";
  constructor(private store: Store<{ appState: AppState }>) { }

  ngOnInit(): void {
    this.store.pipe(
      select(NodeSelectors.selectSelectedNode),
      map(node => node ? ({ id: node.id, code: node.content }) : ({ id: '', code: '' }))
    ).subscribe(({ id, code }) => {
      this.id = id;
      this.code = code ?? "";
    });
  }

  updateCode(newCode: string): void {
    this.code = newCode;
    this.store.dispatch(NodeActions.updateNodeContent({ id: this.id, content: newCode }));
  }
}
