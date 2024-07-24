import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasComponent } from './component/canvas/canvas.component';
import { BoardComponent } from './component/board/board.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { ServerComponent } from './component/nodes/server/server.component';
import { MiddlewareComponent } from './component/nodes/middleware/middleware.component';
import { RouteComponent } from './component/nodes/route/route.component';
import { EditorComponent } from './component/editor/editor.component';
import { StoreModule } from '@ngrx/store';
import { nodeReducer } from './store/node.reducer';
import { CodeComponent } from './component/nodes/code/code.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { TreeComponent } from './shared/tree/tree.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    BoardComponent,
    SideBarComponent,
    ServerComponent,
    MiddlewareComponent,
    RouteComponent,
    EditorComponent,
    CodeComponent,
    ToolbarComponent,
    TreeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    DragDropModule,
    MatToolbarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTreeModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ appState: nodeReducer }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
