import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewScreenComponent } from './interview-screen.component';

describe('InterviewScreenComponent', () => {
  let component: InterviewScreenComponent;
  let fixture: ComponentFixture<InterviewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
