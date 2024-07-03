import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeComponent } from './component/node/node.component';
import { CanvasComponent } from './component/canvas/canvas.component';
import { BoardComponent } from './component/board/board.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { PanelComponent } from './component/panel/panel.component';
import { ServerComponent } from './component/nodes/server/server.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    CanvasComponent,
    BoardComponent,
    SideBarComponent,
    PanelComponent,
    ServerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    DragDropModule,
    MatToolbarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
