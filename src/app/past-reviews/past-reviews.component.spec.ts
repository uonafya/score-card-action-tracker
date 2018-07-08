import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastReviewsComponent } from './past-reviews.component';

describe('PastReviewsComponent', () => {
  let component: PastReviewsComponent;
  let fixture: ComponentFixture<PastReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
