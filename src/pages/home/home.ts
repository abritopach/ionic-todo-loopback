import { Component } from '@angular/core';
import { Platform, NavController, AlertController, reorderArray } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
// Import SocialSharing plugin.
import { SocialSharing } from '@ionic-native/social-sharing';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TodoServiceProvider, SocialSharing]
})
export class HomePage {

  data: any;
  pendingItems: any;
  completedItems: any;
  checked: any[];

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public todoService: TodoServiceProvider,
                public platform: Platform, private socialSharing: SocialSharing) {

        this.pendingItems = [];
        this.completedItems = [];

    }

  ionViewDidLoad() {

    // Faked items.

    /*
    this.pendingItems = [
      {id: 'Task 1', description: 'Poner la lavadora.', priority: 1, status: "pending"},
      {id: 'Task 2', description: 'Hacer la compra.', priority: 2, status: "pending"},
      {id: 'Task 3', description: 'Recoger paquete correos.', priority: 3, status: "pending"}
    ];
    */

      this.todoService.getTodos()
          .then(data => {
              //console.log(data);
              this.data = data;
              for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].status == "Pendiente") this.pendingItems.push(data[i]);
                else this.completedItems.push(data[i]);
              }
              this.data = this.pendingItems;
          });


  }

  getItems(ev: any) {
    // Reset items back to all of the items.
    this.pendingItems = this.data;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.pendingItems = this.pendingItems.filter((item) => {
        return (item.description.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  reorderItems(indexes) {
    //console.log(indexes);
    let currentPriority = this.pendingItems[indexes.from].priority;
    let newPriority = this.pendingItems[indexes.to].priority;
    this.pendingItems = reorderArray(this.pendingItems, indexes);
    this.pendingItems[indexes.to].priority = newPriority;
      this.todoService.updateTodo(this.pendingItems[indexes.to])
          .then(data => {
              //console.log(data);
          });

    this.pendingItems[indexes.from].priority = currentPriority;
      this.todoService.updateTodo(this.pendingItems[indexes.from])
          .then(data => {
              //console.log(data);
          });

  }

  isChecked(item) {
    console.log(item);
    if (item.checked) {
      item.status = "Completedo";

        this.todoService.updateTodo(item)
            .then(data => {
                console.log(data);
                this.completedItems.push(data);
                this.deleteItem(item);
            });
    }
  }

  addItem() {

    let prompt = this.alertCtrl.create({
      title: 'Añadir tarea',
      inputs: [
        {
          name: 'description',
          placeholder: 'Descripción',
        },
        {
          name: 'priority',
          placeholder: 'Prioridad',
          type: 'number',
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Añadir',
          handler: data => {
            data.status = 'Pendiente';

              this.todoService.addTodo(data)
                  .then(result => {
                      //console.log(result);
                      this.pendingItems.push(result);

                      // Sort todos array by priority.
                      this.pendingItems = this.pendingItems.sort((a, b) => a.priority - b.priority);

                  });
          }
        }
      ]
    });

    prompt.present();
  }

    updateItem(item) {

        let prompt = this.alertCtrl.create({
            title: 'Actualizar tarea',
            inputs: [
                {
                    name: 'description',
                    placeholder: 'Descripción',
                    value: item.description
                },
                {
                    name: 'priority',
                    placeholder: 'Prioridad',
                    type: 'number',
                    value: item.priority
                }
            ],
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Actualizar',
                    handler: data => {

                        let index = this.pendingItems.indexOf(item);

                        if(index > -1) {

                            if (data.description != '') this.pendingItems[index].description = data.description;
                            if (data.priority != '') this.pendingItems[index].priority = data.priority;

                            this.todoService.updateTodo(this.pendingItems[index])
                                .then(data => {
                                    //console.log(data);

                                    // Sort todos array by priority.
                                    this.pendingItems = this.pendingItems.sort((a, b) => a.priority - b.priority);
                                });
                        }
                    }
                }
            ]
        });

        prompt.present();
    }

  viewItem(item) {

    let prompt = this.alertCtrl.create({
      title: 'Detalles tarea',
      inputs: [
        /*{
          name: 'id',
          placeholder: 'id',
          value: item.id
        },
        */
        {
          name: 'description',
          placeholder: 'Descripción',
          value: item.description
        },
        {
          name: 'priority',
          placeholder: 'Prioridad',
          type: 'number',
          value: item.priority

        },
        {
          name: 'status',
          placeholder: 'Estado',
          value: item.status

        },
          {
              name: 'created',
              placeholder: 'Fecha creación',
              value: moment(item.created).format("DD/MM/YYYY HH:mm:ss")

          }
      ]
    });

    prompt.present();

  }

  deleteItem(item) {

    let index = this.pendingItems.indexOf(item);

    if(index > -1) {

        this.todoService.deleteTodo(item)
            .then(data => {
                console.log(data);
                this.pendingItems.splice(index, 1);
            });
    }
  }

    formatText() : string {
        var header = "Tareas pendientes" + "\n" +
            "--------------------\n"
        var body = "";
        for (var i = 0; i < this.pendingItems.length; i++) {
            var index = i + 1;
            body = body + index + ". " + "[Prioridad: " + this.pendingItems[i].priority + "] " + this.pendingItems[i].description + "\n";
        }
        var footer = "--------------------\n";
        var text = header + body + footer;
        return text;
    }


    whatsappShare() {
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
            alert("Sólo puedes compartir en un dispositivo móvil.");
        }
        else {
            this.platform.ready().then(() => {
                this.socialSharing.shareViaWhatsApp(this.formatText(), null /*Image*/,  "https://google.com/" /* url */)
                    .then(() => {
                        //alert("Success");
                    }).catch(() => {
                        // Error!
                        alert("Failed");
                    });
            });
        }
    }

    emailShare() {

        if(this.platform.is('core') || this.platform.is('mobileweb')) {
            var email = "someone@example.com?Subject=" + this.formatText();
            window.open(`mailto:${email}`, '_system');
        }
        else {
            this.platform.ready().then(() => {
                // Share via email
                this.socialSharing.shareViaEmail(this.formatText(), "Message via Todo's App", ["recipient@example.org"]).then(() => {
                    //alert("Success");
                    // Success!
                }).catch(() => {
                    // Error!
                    alert("Failed");
                });
            });
        }
    }

}
