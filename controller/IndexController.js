import {loadCustomers} from "../controller/OrderController.js";
import {loadItems} from "../controller/OrderController.js";

console.log("hello")

let home = $(" body > div:nth-child(2) ");
let customers = $(" body > div:nth-child(3) ");
let items = $(" body > div:nth-child(4) ");
let orders = $(" body > div:nth-child(5) ");

const clear = function (){
    home.css("display" , "none")
    customers.css("display" , "none")
    items.css("display" , "none")
    orders.css("display" , "none")
}

$("#home_page").on('click' , () => {
    clear();
    home.css("display" , "flex");

});

$("#customers_page").on('click' , () => {
    clear();
    customers.css("display" , "block");

});

$("#items_page").on('click' , () => {
    clear();
    items.css("display" , "block");

});

$("#orders_page").on('click' , () => {
    clear();
    orders.css("display" , "block");
    loadCustomers();
    loadItems();

});

$("#logo").on('click' , () => {
    clear();
    home.css("display" , "block");

});

$("#home_page").click();



