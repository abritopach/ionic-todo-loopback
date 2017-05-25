import { Component } from '@angular/core';
import { NavController, AlertController, reorderArray } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TodoServiceProvider]
})
export class HomePage {

  data: any;
  pendingItems: any;
  completedItems: any;
  checked: any[];

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public todoService: TodoServiceProvider) {

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
              console.log(data);
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
    console.log(indexes);
    let currentPriority = this.pendingItems[indexes.from].priority;
    let newPriority = this.pendingItems[indexes.to].priority;
    this.pendingItems = reorderArray(this.pendingItems, indexes);
    this.pendingItems[indexes.to].priority = newPriority;
    this.pendingItems[indexes.from].priority = currentPriority;

  }

  isChecked(item) {
    console.log(item);
    if (item.checked) {
      item.status = "completed";

        this.todoService.updateTodo(item)
            .then(data => {
                console.log(data);
                this.completedItems.push(data);
                this.deleteItem(item);
            });
    }
  }

  addItem() {

    let taskIndex = 1;
    if (this.pendingItems.length != 0) {
      taskIndex = this.pendingItems.length + 1;
    }

    let prompt = this.alertCtrl.create({
      title: 'Añadir tarea',
      inputs: [
        {
          name: 'id',
          placeholder: 'ID',
          value: 'Task ' + taskIndex,
        },
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
            data.status = 'pending';
            this.pendingItems.push(data);
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
              value: item.created

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

}
