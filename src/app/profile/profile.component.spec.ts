import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';

class MockSrv {
  userDetails() {
    return {};
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let theService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        ProfileComponent,
        { provide: UserService, useClass: MockSrv }
      ]
    });
    component = TestBed.get(ProfileComponent);
    theService = TestBed.get(UserService);
   });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
