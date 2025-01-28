import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponentOperator  } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponentOperator;
  let fixture: ComponentFixture<RegisterComponentOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponentOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponentOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
