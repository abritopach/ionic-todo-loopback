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
    result: any;

    constructor(public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController, public todoService: TodoServiceProvider) {

        this.task = {description: "", priority: 0, categories: "Selecciones"};

        /*
        this.creditCard = this.params.get('item');

        if (this.creditCard.type == "credito") {
            this.creditCard.liquidationPeriod.lower = this.creditCard.liquidationPeriod.start;
            this.creditCard.liquidationPeriod.upper = this.creditCard.liquidationPeriod.end;
        }
        */
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    showAlert(title: any, subTitle: any) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
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

                        /*
                        this.creditCardService.update(this.creditCard)
                            .then(data => {
                                //console.log(data);
                                this.result = data;
                                if (this.result.success == false) this.showAlert('ERROR', this.result.message);
                                else {
                                    this.showAlert('INFO', this.result.message);
                                }
                                loader.dismiss();
                            });
                            */
                    }
                }
            ]
        });
        alert.present();
    }
}