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
  private proxyAsync;
  private selectedChannelAsync;
  private selectedItemAsync;

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
    await window['CefSharp'].BindObjectAsync('pluginProxyAsync')
      .then(result => {
        if (result.Success) {
          this.proxyAsync = window['pluginProxyAsync'];
        }
      })
      .catch(error => {
        console.log(error);
      });

    // await window['CefSharp'].BindObjectAsync('pluginProxy')
    //   .then(result => {
    //     if (result.Success) {
    //       this.proxy = window['pluginProxy'];
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    await window['CefSharp'].BindObjectAsync('selectedChannel')
      .then(result => {
        if (result.Success) {
          this.selectedChannelAsync = window['selectedChannel'];
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  public selectedItemUpdated() {
    console.log(new Date().toLocaleString() + ': selectedItemUpdated');

    // this.proxyAsync.getSelectedChannelJson()
    //   .then(res => {
    //     const channel = JSON.parse(res);
    //     this.currentMcrItem.name = channel.OnAirItem.Name;
    //     this.cuedMcrItem.name = channel.CuedItem.Name;
    //     //alert(JSON.parse(channel.GetProgramsJson));
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    this.proxyAsync.getSelectedItem()
      .then(res => {
        this.selectedMcrItem.name = res.Name;
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
    console.log(new Date().toLocaleString() + ': clearItem');
    
    this.selectedChannelAsync.getPrograms()
    .then(res => {
      //const item = JSON.parse(res);
      this.selectedMcrItem.name = res;
    })
    .catch(error => {
      console.log(error);
    }); 
  }

  public testItemClick() {
    console.log(new Date().toLocaleString() + ': testItemClick');
    
    if(this.selectedItemAsync == null)
    {
      window['CefSharp'].BindObjectAsync('selectedItem')
      .then(result => {
        if (result.Success) {
          this.selectedItemAsync = window['selectedItem'];
          this.updateName();
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    else
    {
      this.updateName();
    }      

   
  }

  private updateName()
  {
    if(this.selectedItemAsync == null)
    {
      console.log("Why is this null!!??");
      return;
    }

    this.selectedItemAsync.getName()
    .then(res => {
      //const item = JSON.parse(res);
      this.selectedMcrItem.name = res;
      var delObj = window['CefSharp'].DeleteBoundObject('selectedItem');
      this.selectedItemAsync = null;
    })
    .catch(error => {
      console.log(error);
    }); 
  }

}
