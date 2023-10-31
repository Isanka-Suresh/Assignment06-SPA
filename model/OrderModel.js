export class OrderModel {
    constructor(id , date , total ,  customerModel , items ) {
        this.id = id;
        this.date = date;
        this.total = total;
        this.customerModel = customerModel;
        this.items = items;
    }
}

