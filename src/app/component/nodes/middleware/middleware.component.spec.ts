import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddlewareComponent } from './middleware.component';

describe('MiddlewareComponent', () => {
  let component: MiddlewareComponent;
  let fixture: ComponentFixture<MiddlewareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiddlewareComponent]
    });
    fixture = TestBed.createComponent(MiddlewareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
