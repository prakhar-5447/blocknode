import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonacoEditorService {
  private loaded: boolean = false;
  private loadingFinished: Subject<void> = new Subject<void>();

  loadMonaco(): Observable<void> {
    if (this.loaded) {
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }


    const onGotAmdLoader = () => {
      (window as any).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.loaded = true;
        this.loadingFinished.next();
        this.loadingFinished.complete();
      });
    };

    if (!(window as any).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }

    return this.loadingFinished.asObservable();
  }
}
