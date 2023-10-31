import {customers, items} from "../db/DB.js";
import {ItemModel} from "../model/ItemModel.js";
var row_index = -1;

let codeInput = $("#itemId");
let nameInput = $("#description");
let priceInput = $("#unitPrice");
let qtyInput = $("#qty");

const clear = () => {
    $("#item_reset").click();

}

// load all data to table
const loadAllTableData = () => {
    $("#item_table>tbody").empty()
    items.map((item) => {
        $("#item_table > tbody").append(`<tr><td>${item.code}</td><td>${item.name}</td><td>${item.price}</td><td>${item.qty}</td></tr>`);
    });
};

loadAllTableData();

// search
$("#item_search").on('click', () => {
    try {
        let item = items.find(item => item.code == $("#searchItem").val());
        if (item == null){
            item = items.find(item => item.name == $("#searchItem").val());
        }

        codeInput.val(item.code);
        nameInput.val(item.name);
        priceInput.val(item.price);
        qtyInput.val(item.qty);

        row_index = items.findIndex(i => i.code == item.code);

    } catch (e) {
        clear();
        alert("Can't find item , sorry !");

    }

});

// save
$("#item_submit").on('click', () => {
    items.push(new ItemModel(codeInput.val(), nameInput.val(), priceInput.val(), qtyInput.val()));
    loadAllTableData();
    clear();
});

// update
$("#item_update").on('click', () => {
    if (row_index==-1){
        alert("Select or search Customer.");
        return;
    }

    items[row_index] = new ItemModel(codeInput.val(), nameInput.val(), priceInput.val(), qtyInput.val());
    loadAllTableData();
    clear();

    row_index = -1;
});

// delete
$("#item_delete").on('click', () => {
    if (row_index === -1) {
        alert("Select or search Customer.");
        return;
    }

    items.splice(row_index, 1);
    loadAllTableData();
    clear();
    row_index = -1;

});

// clear
// $("#i_clear_btn").on('click', () => {
//     clear();
//     row_index = -1;
// });

// table select
$("#item_table").on('click', 'tr', function(){
    let selectedId = $(this).find("td:first-child").text();
    row_index = items.findIndex(items => items.code === selectedId);

    codeInput.val($(this).find("td:first-child").text());
    nameInput.val($(this).find("td:nth-child(2)").text());
    priceInput.val($(this).find("td:nth-child(3)").text());
    qtyInput.val($(this).find("td:nth-child(4)").text());

});







