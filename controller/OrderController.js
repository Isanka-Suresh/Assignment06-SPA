import {items} from "../db/DB.js";
import {customers} from "../db/DB.js";
import {orders} from "../db/DB.js";
import {OrderModel} from "../model/OrderModel.js";
import {CustomerModel} from "../model/CustomerModel.js";
import {ItemModel} from "../model/ItemModel.js";

// let rowIndex = -1;
let customer = null;
let item = null;
let total = 0;
let subTotal = 0;
let orderItems = [];


// set fields uneditable
function fieldsLock() {
    $("#c_name").attr("readonly", true);
    $("#c_address").attr("readonly", true);
    $("#c_salary").attr("readonly", true);

    $("#i_name").attr("readonly", true);
    $("#i_price").attr("readonly", true);
    $("#i_qty_on_hand").attr("readonly", true);

    $("#o_id").attr("readonly", true);
    $("#date").attr("readonly", true);

    $("#balance").attr("readonly", true);

}

// set current date
function currentDate() {
    let currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currentDate.getFullYear();

    currentDate = yyyy + '-' + mm + '-' + dd;

    $("#date").val(currentDate);

}

// generate oder ID
function generateOId() {
    if (orders.length === 0) {
        $("#o_id").val("O001");
        return;
    }
    let lastId = orders[orders.length - 1].id;
    lastId = lastId.substring(1);

    let newId = Number.parseInt(lastId) + 1 + "";
    newId = newId.padStart(3, "0");

    $("#o_id").val("O" + newId);


}

// load order's items
const loadOrderItems = () => {
    $("#o_table>tbody").empty();

    orderItems.map((item) => {
        $("#o_table>tbody").append(
            `<tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td>
                    <div class="container">
                        <div style="justify-content: center" class="row">
                            <button type="button"
                                class="col col-12 col-sm12 col-md-8 col-lg-8 col-xl-4 col-xxl-4 btn btn-danger remove-t-btn"
                                data-index = ${item.code}
                                >
                                    Remove
                            </button>
                        </div>
                     </div>
                </td>
            </tr>`
        );
    });
};

// load customers
const loadCustomers = () => {
    $("#customer").empty();
    $("#customer").append(`<option value="" hidden selected>Select Customer</option>`);
    customers.map((customer) => {
        $("#customer").append(`<option value="${customer.id}">${customer.id}</option>`);
    });

    customer = null;
    $("#c_name").val("");
    $("#c_address").val("");
    $("#c_salary").val("");

};

// load items
const loadItems = () => {
    $("#item").empty();
    $("#item").append(`<option value="" hidden selected>Select Item</option>`);
    items.map((item) => {
        $("#item").append(`<option value="${item.code}">${item.code}</option>`);
    });

    item = null;
    $("#i_name").val("");
    $("#i_price").val("");
    $("#i_qty_on_hand").val("");

};

$("#customer").on('change', function () {
    let customerId = $(this).val();
    customer = customers.find(customer => customer.id === customerId);
    $("#c_name").val(customer.name);
    $("#c_address").val(customer.address);
    $("#c_salary").val(customer.salary);

});

$("#item").on('change', function () {
    loadItem();
});

function loadItem() {
    let itemCode = $("#item").val();
    item = items.find(item => item.code === itemCode);
    $("#i_name").val(item.name);
    $("#i_price").val(item.price);
    $("#i_qty_on_hand").val(item.qty);
    $("#i_qty").val("");

}

$("#o-add-item-btn").on("click", () => {
    let qty = Number.parseInt($("#i_qty").val());

    if ((item.qty - qty) < 0) {
        alert("insufficient space");
        return;
    }

    item.qty = item.qty - qty;

    let orderItem = findOrderItem(item.code);

    if (orderItem != null) {
        orderItem.qty = Number.parseInt(orderItem.qty) + qty;

    } else {
        let tempItem = new ItemModel(item.code, item.name, item.price, qty);
        orderItems.push(tempItem);

    }

    loadItem();
    loadOrderItems();
    calcTotal();
    calcBalance();
});

function findOrderItem(code) {
    return orderItems.find(item => item.code === code);

}

function calcTotal() {
    total = 0;
    orderItems.map(orderItem => {
        total += (orderItem.qty * orderItem.price);
    });

    $("#total").text("Total : " + total + "/=");
    calcDiscount(total);
    console.log(total);

}

function calcDiscount(total) {
    let discount = $("#discount").val();
    subTotal = total;
    if (discount != null) {
        subTotal -= ((subTotal * discount) / 100.0);
    }

    $("#sub-total").text("Sub Total : " + subTotal + "/=");

}

function calcBalance() {
    let cash = $("#cash").val();
    $("#balance").val(cash - subTotal);
}

$("#discount").on("input", () => {
    calcDiscount(total);
    calcBalance();

});

$("#cash").on("input", function () {
    calcBalance();
});

// set remove btn action
$("#o_table").on("click", "button", function () {
    let itemCodeRBtn = $(this).attr("data-index");
    let itemOnOrder = orderItems.find(item => item.code == itemCodeRBtn);
    let itemOnDB = items.find(item => item.code == itemCodeRBtn);

    itemOnDB.qty += itemOnOrder.qty;

    orderItems.splice(item => item.code == itemCodeRBtn, 1);

    calcTotal();
    loadItem();
    loadOrderItems();
    calcBalance();

});

// do purchase
$("#purchase_btn").on("click", () => {
    let order = new OrderModel(
        $("#o_id").val() ,
        $("#date").val() ,
        total ,
        subTotal ,
        $("#discount").val(),
        new CustomerModel(customer.code, customer.name , customer.address , customer.salary),
        orderItems
    );

    orders.push(order);

    orderItems = [];
    $("#orders_page").click();
    loadOrderItems();
});

export function init() {
    fieldsLock();
    currentDate();
    generateOId();
    loadItems();
    loadCustomers();

    $("#total").text("Total : 0/=");
    $("#sub-total").text("Sub Total : 0/=");
    $("#cash").val("");
    total = 0;
    subTotal = 0;
    calcBalance();
}







