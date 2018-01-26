import { TestClass } from './models/test-class';
import { Component, NgZone } from '@angular/core';
import { McrItem } from './models/mcritem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'The Air Panel Demo';

  public currentMcrItem: McrItem;

  constructor(private zone: NgZone) {
    window['angularComponentRef'] = {
      zone: this.zone,
      selectedItemUpdated: () => this.selectedItemUpdated(),
      app: () => this,
      component: this
    };

    this.currentMcrItem = new McrItem();

    this.currentMcrItem.Name = 'Item Name';
    this.currentMcrItem.Comment = 'Item Default Comment';

    if (this.currentMcrItem.Name === 'jjj') {
      this.selectedItemUpdated();
    }
  }

  public selectedItemUpdated(): void {
    this.currentMcrItem.Name = 'Fired!';
  }

  public playItem(item: McrItem): boolean {
    // let wang = window.external['Numberwang'];
    // item.Name = `C# apps say numberwang is: ${wang}`;

    const test: TestClass =  window['testObject'];
    this.currentMcrItem.Name = test.prop1;
    const result = test.method1(this.currentMcrItem.Name);
    alert(`Count: ${result}`);

    return false;
  }

  public clearItem(item: McrItem): boolean {
    window.external['Test']('Current item name: ' + item.Name);

    return false;
  }

  public sayHello() {
    alert('Hello from Angular');
  }
}
