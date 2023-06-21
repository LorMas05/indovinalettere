import { TestBed } from '@angular/core/testing';

import { LoggedServiceService } from './logged-service.service';

describe('LoggedServiceService', () => {
  let service: LoggedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
