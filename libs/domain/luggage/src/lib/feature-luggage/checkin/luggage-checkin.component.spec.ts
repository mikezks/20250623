import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuggageCheckinComponent } from './luggage-checkin.component';

describe('LuggageCheckinComponent', () => {
  let component: LuggageCheckinComponent;
  let fixture: ComponentFixture<LuggageCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuggageCheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LuggageCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
