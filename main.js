'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},
  ],
  hideChecked: false,
  searchTerm: null
};

function generateItemElement(item, itemIndex, template) {
  return `<li class="js-item-index-element ${itemIndex}" data-item-index="${itemIndex}" ${isHidden(item) ? 'style="display: none;"' : ''}">
  <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
  <div class="shopping-item-controls">
    <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
    </button>
    <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
    </button>
  </div>
</li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
    
  return items.join('');
}
  
function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  // let shoppingListItemsString;
  // if(checkedItems) {
  //   shoppingListItemsString = generateShoppingItemsString(checkedItems);
  // } else {
  //   shoppingListItemsString = generateShoppingItemsString(STORE);
  // }
  let {items} = STORE;
  const shoppingListItemsString = generateShoppingItemsString(items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}
  
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}
  
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}
  
function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}
  
function getItemIndexFromElement(item) {
  console.log('item is:' + item);
  const itemIndexString = $(item)
  
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
  
}
  
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}
  
  
function handleDeleteItemClicked() {
  // Listen for when users want to delete an item and 
  // delete it
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items.splice(itemIndex, 1);
    renderShoppingList();
  });
}

//Extension features
$(document).on('click', '.shopping-item', event => {
  $('.shopping-item').attr('contentEditable',true);
});

function isHidden(item) {
  if (STORE.hideChecked && item.checked) {
    return true;
    // also return FALSE if the item's name is NOT in search term
  // because we DO want to see it
  }
}

//Handele toggle button
function toggleCheckedVisibility() {
  STORE.hideChecked = !STORE.hideChecked;
}
//Show all items or unchecked items
function showUncheckedItems() {
  $('.switch').on('click', '.show', function(event) {
    toggleCheckedVisibility();
    renderShoppingList();
  });
}

//Retrieve text input
function updateSearchTerm(searchTerm) {

  //Array containing objects
  const array = STORE.items;
  console.log(array);

  //Array containing unchecked objects
  const namesUnchecked = array.filter(item => !item.checked);
  console.log(namesUnchecked);

  //Create an array containing unchecked names
  let arrayUncheckedNames = [];
  for (let i = 0; i < namesUnchecked.length; i++) {
    arrayUncheckedNames.push(namesUnchecked[i].name);
  }
  console.log(arrayUncheckedNames);

  //Conditions to toggle names that is not "searchTerm"
  if (!arrayUncheckedNames.includes(searchTerm)) {
    console.log('NO MATCHING!!!');
    return 'No Matching';
  }
  else {
    for (let k = 0; k < namesUnchecked.length; k++) {
      if (namesUnchecked[k].name !== searchTerm) {
        let index = array.indexOf(namesUnchecked[k]);
        console.log(index);
        toggleCheckedForListItem(index);
      }
    }
  }
}
 
//Search terms
function handleSearchSubmit() {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val();
    $('.js-search-term').val('');
    toggleCheckedVisibility();
    updateSearchTerm(searchTerm);
    console.log(searchTerm);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  showUncheckedItems();
  handleSearchSubmit();
}
  
$(handleShoppingList);
