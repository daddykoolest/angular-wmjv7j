import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule } from "ngx-toastr";

import { ToastService } from './toast.service';

describe('ToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ToastrModule.forRoot()],
    providers: [ToastrService]
    })

  );

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });
});
