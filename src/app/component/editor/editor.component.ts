import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent {
  @Input() code: string | null = null;

  getCodeForNode(nodeName: string): string {
    // Replace with logic to fetch or generate code for the node
    return `// Code for ${nodeName}`;
  }
}
