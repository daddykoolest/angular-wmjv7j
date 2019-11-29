import { Component, OnInit, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { CommandGroup } from '../objects/commandGroup';
import { CommandService } from '../services/commands/command.service';
import { ToastService} from '../services/toast/toast.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit, AfterViewChecked {

  commands: CommandGroup[];
  responseStatus: string;
  noCommands: string;
  commandName: string;

  message = 'Command selected';

  @Output() messageEvent1 = new EventEmitter<string>();

  constructor(private commandService: CommandService, private toasterService: ToastService) { }

  ngOnInit() {
    this.getCommands();
  }

  ngAfterViewChecked() {
    if (localStorage.getItem('commandChosen') !== null) {
      this.setSelectedCommand();
      this.sendMessage();
    }
  }

  getCommands(): void {
    this.commandService.getAllCommandGroups()
    .subscribe((commands) => {
      if (commands.status === 200) {
        this.responseStatus = '200';
        this.commands = commands.body;
      } else if ( commands.status === 204) {
        this.responseStatus = '204';
        this.toasterService.showInfo('No commands are available.', 'Commands');
      } else {
        this.toasterService.showError('There was a problem retrieving the commands.', 'Commands');
      }
  });
}

  chooseCommand(commandId: string, name: string): void {
    var chosenCommand = localStorage.getItem('commandChosen');
    var selectedCommandId;

    if (chosenCommand !== null) {
      selectedCommandId = '#' + Object.keys(JSON.parse(localStorage.getItem('commandChosen')))[0];
    }

    if ( $(selectedCommandId).hasClass('selected-command')) {
      $(selectedCommandId).removeClass('selected-command');
    }

    localStorage.setItem('commandChosen', '{"' + commandId + '":"' + name + '"}');
    localStorage.setItem('commandStarted', 'true');
    if (localStorage.getItem('parameters') !== null) {
      localStorage.removeItem('parameters');
    }
    if (localStorage.getItem('minionChosen') !== null) {
      localStorage.removeItem('minionChosen');
    }
    var elId = '#' + commandId;
    $(elId).addClass('selected-command');
    this.sendMessage();
  }

  sendMessage() {
    this.messageEvent1.emit(this.message)
  }

  resetAll(): void {
    this.commands.forEach(command => {
      var elId = '#' + command.Id;
      if ( $(elId).hasClass('selected-command')) {
        $(elId).removeClass('selected-command');
      }
    })
  }

  setSelectedCommand(): void {
    var chosenCommand = localStorage.getItem('commandChosen');
    var selectedCommandId;

    if (chosenCommand !== null) {
      selectedCommandId = '#' + Object.keys(JSON.parse(localStorage.getItem('commandChosen')))[0];
      $(selectedCommandId).addClass('selected-command');
    }
  }
}
