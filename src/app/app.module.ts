import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeComponent } from './component/node/node.component';
import { CanvasComponent } from './component/canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    DragDropModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
