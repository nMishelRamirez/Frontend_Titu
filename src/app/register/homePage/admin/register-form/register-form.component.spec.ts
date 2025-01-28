import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponentAdmin } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponentAdmin;
  let fixture: ComponentFixture<RegisterFormComponentAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponentAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponentAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
