import { TestBed } from '@angular/core/testing';

import { RoleGuardService } from './role-guard.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoleGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule]
  }));

  it('should be created', () => {
    const service: RoleGuardService = TestBed.get(RoleGuardService);
    expect(service).toBeTruthy();
  });
});
