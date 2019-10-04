import {templates,select} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element){
    const  thisBooking = this;


    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    /* generate html from template without argument*/
    const generatedHtml = templates.bookingWidget();
    //console.log('generated html', generatedHtml);
    /* create empty object thisBooking.dom */
    thisBooking.dom = {};
    console.log('thisBooking.dom', thisBooking.dom);
    /* save thisBooking.dom.wrapper to returned argument element*/
    thisBooking.dom.wrapper = element;

    /* changed wrapper to html code */
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHtml);
    console.log(thisBooking.dom.wrapper);
    /* find booking container widget defined in initBooking*/
    const bookingContainerWidget = document.querySelector(select.containerOf.booking);
    bookingContainerWidget.appendChild(thisBooking.dom.wrapper);

    /* find single element for people amount */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    console.log('peopleAmount', thisBooking.dom.peopleAmount);
    /* find single element for hours amount */
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    console.log('hoursAmount', thisBooking.dom.hoursAmount);



  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}
export default Booking;
