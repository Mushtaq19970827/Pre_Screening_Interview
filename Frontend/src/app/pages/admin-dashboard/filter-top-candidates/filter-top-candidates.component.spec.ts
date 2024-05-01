import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTopCandidatesComponent } from './filter-top-candidates.component';

describe('FilterTopCandidatesComponent', () => {
  let component: FilterTopCandidatesComponent;
  let fixture: ComponentFixture<FilterTopCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterTopCandidatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterTopCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
