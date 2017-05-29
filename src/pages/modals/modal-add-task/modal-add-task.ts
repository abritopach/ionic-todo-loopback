import { Component } from '@angular/core';

import { NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

import { TodoServiceProvider } from '../../../providers/todo-service/todo-service';

@Component({
    selector: 'modal-add-task',
    templateUrl: 'modal-add-task.html',
    providers: [TodoServiceProvider]
})

export class ModalAddTask {

    task: any;
    categories: any;
    selectedCategories: any;
    result: any;

    constructor(public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController, public todoService: TodoServiceProvider) {

        this.task = {description: "", priority: 0, status: "Pendiente"};

    }

    ionViewDidLoad() {
        this.todoService.getCategories()
            .then(data => {
                //console.log(data);
                this.categories = data;
            });
    }

    dismiss() {
        this.viewCtrl.dismiss(this.task);
    }

    addTask() {

        let alert = this.alertCtrl.create({
            title: 'Añadir tarea',
            message: '¿Estás seguro de añadir esta tarea?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {

                        let loader = this.loadingCtrl.create({
                            content: "Please wait..."
                        });
                        loader.present();

                        this.todoService.addTodo(this.task)
                            .then(data => {
                                //console.log(data);
                                this.todoService.addCategory2Todo(data, this.selectedCategories)
                                    .then(data => {
                                        console.log(data);
                                    });
                                loader.dismiss();
                                this.viewCtrl.dismiss(data);
                            });
                    }
                }
            ]
        });
        alert.present();
    }
}