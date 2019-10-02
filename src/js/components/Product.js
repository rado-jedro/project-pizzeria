import {select, classNames, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';

class Product{
  constructor(id,data){
    const thisProduct = this;
    thisProduct.id=id;
    thisProduct.data=data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product:', thisProduct);
  }
  initAccordion(){
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    //let trigger = thisProduct.element.querySelector('.product__header');
    // //console.log(trigger);
    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function(){
    /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
    /* find all active products */
    const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
    /* START LOOP: for each active product */
    for(let activeProduct in activeProducts){
    /* START: if the active product isn't the element of thisProduct */
      if (activeProduct == !thisProduct.element) {
        /* remove class active for the active product */
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        /* END: if the active product isn't the element of thisProduct */
      }
    /* END LOOP: for each active product */
    }
    /* END: click event listener to trigger */
  }
  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated',function(){
      thisProduct.processOrder();
    });
  }
  processOrder(){
    const thisProduct = this;
    //console.log(thisProduct);
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData',formData);
    thisProduct.params ={};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    //console.log(price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      //console.log(paramId);
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];
      //console.log(param);
      /* START LOOP: for each optionId in param.options */
      for(let optionId in param.options){
        //console.log(optionId);
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];
        //console.log(option);
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        //console.log(optionSelected);
        /* START IF: if option is selected and option is not default */
        if(optionSelected && !option.default){
        /* add price of option to variable price */
          price = price + option.price;
        /* END IF: if option is selected and option is not default */
        }
        /* START ELSE IF: if option is not selected and option is default */
        else if (!optionSelected && option.default){
        /* deduct price of option from price */
          price = price - option.price;
        /* END ELSE IF: if option is not selected and option is default */
        }
        /*   START DISPLAY SELECTED OPTIONS - TASK 8.6   */
        /*save elements to const */
        const allImages = thisProduct.imageWrapper.querySelectorAll('.'+paramId + '-' +optionId);
        //console.log(allImages);
        /*START LOOP: if option selected */
        if (optionSelected) {
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
            //console.log(thisProduct.params[paramId]);
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          //console.log(option.label);
          /*START LOOP: check if option is selected*/
          for(let singleImage of allImages){
            /*add class acvite*/
            singleImage.classList.add(classNames.menuProduct.imageVisible);
          }
          /*END LOOP for each image*/
        }
        /*else if option is not selected*/
        else  {
          /*start loop*/
          for(let singleImage of allImages){
            /*remove active class*/
            singleImage.classList.remove(classNames.menuProduct.imageVisible);
            /*end loop*/
          }
        /*END else block*/
        }
      /* END LOOP: for each optionId in param.options */
      }
    /* END LOOP: for each paramId in thisProduct.data.params */
    }
    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log(thisProduct.params);
  }

  renderInMenu(){
    const thisProduct = this;

    /*generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /*create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    //console.log(thisProduct.element);
    /*find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    //console.log(menuContainer);
    /* add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

}

export default Product;
