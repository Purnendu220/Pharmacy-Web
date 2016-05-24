import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import {FirebaseService} from '../firebase/firebase.service';

@Component({
    moduleId: module.id,
    selector: 'order-list',
    template: require('./order-list.component.html')
})
export class OrderList implements OnInit, OnChanges {

    @Input("order_status") orderStatus: string = "OPEN";
    @Output() orderSelected: EventEmitter<any> = new EventEmitter();
    public orderList: any[] = [];
    private selectedOrder: any;
    private ordersRef: any;
    private hasInitialLoad: boolean = false;

    constructor(private _firebase: FirebaseService) {
        this.ordersRef = this._firebase.getRootDatabase().ref('orders').orderByChild('status').equalTo("OPEN");

    }

    ngOnInit() { }

    ngOnChanges(changes: {}) {

        if (this.orderStatus == null) {
            this.orderStatus = "OPEN";
        }

        this.ordersRef.off();
        this.ordersRef = this._firebase.getRootDatabase().ref('orders').orderByChild('status').equalTo(this.orderStatus);
        var that = this;
        this.ordersRef.once('value').then(function (snapshot) {

            snapshot.forEach((childSnapshot) => {
                that.orderList.unshift(childSnapshot.val());
            });

            // set selectedOrder to first item
            that.selectOrder(that.orderList[0]);
            // indicate that initially data has loaded
            that.hasInitialLoad = true;
        });
    }

    selectOrder(order) {
        this.selectedOrder = order;
        this.orderSelected.emit(this.selectedOrder);
    }
}
