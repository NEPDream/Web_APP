import { TestBed } from '@angular/core/testing';

import { IssuetrackerService } from './issuetracker.service';

describe('IssuetrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssuetrackerService = TestBed.get(IssuetrackerService);
    expect(service).toBeTruthy();
  });
});
