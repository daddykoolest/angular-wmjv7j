import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NewUserComponent } from './newuser.component';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule, HttpClientTestingModule ],
      declarations: [ NewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
