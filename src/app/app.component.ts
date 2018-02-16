import { TestClass } from './models/test-class';
import { Component, NgZone } from '@angular/core';
import { McrItem } from './models/mcritem';
import { promise } from 'selenium-webdriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'The Air Panel Demo';

  public currentMcrItem: McrItem;
  public cuedMcrItem: McrItem;
  public selectedMcrItem: McrItem;

  constructor(private zone: NgZone) {
    window['angularComponentRef'] = {
      zone: this.zone,
      selectedItemUpdated: () => this.selectedItemUpdated(),
      app: () => this,
      component: this
    };

    this.currentMcrItem = new McrItem();
    this.cuedMcrItem = new McrItem();
    this.selectedMcrItem = new McrItem();

    window['CefSharp'].BindObjectAsync("pluginProxy");

    //window['CefSharp'].BindObjectAsync("pluginProxyAsync");
  }

  public selectedItemUpdated(): void {
    var proxy = window['pluginProxy'];   

    this.currentMcrItem.Name =  proxy.getSelectedChannel().onAirItem.name;
    this.cuedMcrItem.Name = proxy.getSelectedChannel().cuedItem.name;
    this.selectedMcrItem.Name = proxy.getSelectedItem().name;
  }

  public async playItem() {

   // var timePromise = window['pluginProxyAsync'].getTime('CefSharp');
   // timePromise.then((val) => this.currentMcrItem.Comment = val);
    var proxy = window['pluginProxy'];
    
    proxy.startCuedOnCurrentChannel();
  }

  public async clearItem() {
  }

}
