import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaModalComponent } from './captcha-modal.component';

describe('CaptchaModalComponent', () => {
  let component: CaptchaModalComponent;
  let fixture: ComponentFixture<CaptchaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptchaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptchaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
