import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengMessagesComponent} from './primeng-messages.component';

describe('PrimengMessagesComponent', () => {
  let component: PrimengMessagesComponent;
  let fixture: ComponentFixture<PrimengMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengMessagesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
