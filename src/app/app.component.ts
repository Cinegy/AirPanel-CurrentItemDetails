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
  private proxy;

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

    this.initBinding();
  }

  public async initBinding() {
    await window['CefSharp'].BindObjectAsync('pluginProxy')
      .then(result => {
        if (result.Success) {
          this.proxy = window['pluginProxy'];
        }
      });
  }

  public selectedItemUpdated() {
    console.log('Update');
    this.proxy.getSelectedChannelAsync()
      .then(res => {
        const channel = JSON.parse(res);
        this.currentMcrItem.name = channel.OnAirItem.Name;
        this.cuedMcrItem.name = channel.CuedItem.Name;
        this.selectedMcrItem.name = channel.Name;
      })
      .catch(error => {
        console.log(error);
      });
  }

  public playItem() {
    console.log('Play Item');

    this.proxy.startCuedOnCurrentChannel()
      .then(() => {
        console.log('Success');
      })
      .catch(error => {
        console.log(error);
      });

  }

  public clearItem() {
    console.log('Clear Item');
  }

}
