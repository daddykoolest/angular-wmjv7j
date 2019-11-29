import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from '../user/user.service';

class MockSrv {
  logout() {    
  }
}


describe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
      {provide: UserService, useValue: MockSrv}
    ]
  }));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.get(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
