import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInterviewsComponent } from './assign-interviews.component';

describe('AssignInterviewsComponent', () => {
  let component: AssignInterviewsComponent;
  let fixture: ComponentFixture<AssignInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignInterviewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
