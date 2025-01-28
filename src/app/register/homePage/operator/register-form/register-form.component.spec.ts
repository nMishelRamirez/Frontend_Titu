import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponentOperator } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponentOperator;
  let fixture: ComponentFixture<RegisterFormComponentOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponentOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponentOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
