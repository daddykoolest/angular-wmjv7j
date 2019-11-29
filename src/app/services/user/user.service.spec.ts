import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';

describe('UserService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [HttpClient, JwtHelperService]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
