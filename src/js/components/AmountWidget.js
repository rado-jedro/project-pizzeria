import {select,settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';

/* class AmountWidget is an extension of class BaseWidget*/
class AmountWidget extends BaseWidget{
  constructor(element){
    /*must have super() and refers to class BaseWidget */
    super(element,settings.amountWidget.defaultValue);

    const thisWidget = this;
    thisWidget.getElements(element);

    //delete dependency of extended class
    // thisWidget.value = settings.amountWidget.defaultValue;
    // thisWidget.setValue(thisWidget.dom.input.value);

    thisWidget.initActions();
    //console.log('AmountWidget:',thisWidget);

  }
  getElements(){
    const thisWidget=this;

    // thisWidget.element = element; moved to BaseWidget
    // thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input); changed to thisWidget.dom.wrpapper
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

  }

  /* methods: set value and parseValue(value) have been moved to BaseWidget as does not have any dependancy in AmountWidget*/

  // setValue(value){
  //   const thisWidget=this;
  //   const newValue = thisWidget.parseValue(value);

  //   /*Add validiation */
  //   if(
  //     newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
  //     thisWidget.correctValue = newValue;
  //     thisWidget.announce();
  //   }

  //   thisWidget.renderValue();

  // }

  /* this method overrides parseValue(value) from class BaseWidget*/
  isValid(value){
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget=this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  /* method announce has been moved to class BaseWidget*/

}

export default AmountWidget;
