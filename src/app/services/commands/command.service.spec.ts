import { TestBed } from '@angular/core/testing';

import { CommandService } from './command.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommandService', () => {
  let httpClientSpy: { get: jasmine.Spy};

  let commandService: CommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpClient]
    })
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    commandService = new CommandService(<any> httpClientSpy);
  });

  it('should be created', () => {
    const service: CommandService = TestBed.get(CommandService);
    expect(service).toBeTruthy();
  });
});
