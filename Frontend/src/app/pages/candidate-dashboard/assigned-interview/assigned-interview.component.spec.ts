import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedInterviewComponent } from './assigned-interview.component';

describe('AssignedInterviewComponent', () => {
  let component: AssignedInterviewComponent;
  let fixture: ComponentFixture<AssignedInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedInterviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
