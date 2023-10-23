import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageNotFoundComponent} from './page-not-found.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('Unit Tests: PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  const startPage = 'Startseite';

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( `should have ${startPage} as inner text value`, () => {
    const anchorTag = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
    expect(anchorTag.innerText).toEqual(startPage);
  });
});
