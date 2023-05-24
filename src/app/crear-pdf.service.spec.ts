import { TestBed } from '@angular/core/testing';

import { CrearPDFService } from './crear-pdf.service';

describe('CrearPDFService', () => {
  let service: CrearPDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
