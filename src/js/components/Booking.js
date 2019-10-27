import {templates,select, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element){
    const  thisBooking = this;


    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.initActions();
    thisBooking.getData();
    thisBooking.initBoooking();
  }

  getData(){
    const  thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    /* params*/
    const params = {
      booking:  [
        startDateParam,
        endDateParam,

      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('getData params',params);

    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsRepeat.join('&'),
    };

    //console.log('urls',urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];

        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);

      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings, eventsCurrent, eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  /*parseData retrieve data from API */
  parseData(bookings, eventsCurrent, eventsRepeat){
    const  thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){

      /* check if item.table is an array*/
      if(!Array.isArray(item.table)){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }
      else{
      /* loop throuogh all elements in array item.table*/

        for(let table of item.table){
          thisBooking.makeBooked(item.date, item.hour, item.duration, (table));
          console.log(table);
        }
      }
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
      console.log('thisBooking.booked',thisBooking.booked);
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const  thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock<startHour+duration; hourBlock+=0.5){
      //console.log('loop',hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      //object thisBooking.booked with key date and hour we add new element to array table
      thisBooking.booked[date][hourBlock].push(table);
    }
    console.log(thisBooking.table);
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;
    /* CHECK IF ALL TABLES ARE AVAILABLE*/
    if (typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
      for (let table of thisBooking.dom.tables) {
        table.classList.remove(classNames.booking.tableSelected);
      }
    }
  }


  render(element) {
    const thisBooking = this;

    /* generate html from template without argument*/
    const generatedHtml = templates.bookingWidget();
    ////console.log('generated html', generatedHtml);
    /* create empty object thisBooking.dom */
    thisBooking.dom = {};
    //console.log('thisBooking.dom', thisBooking.dom);
    /* save thisBooking.dom.wrapper to returned argument element*/
    thisBooking.dom.wrapper = element;

    /* changed wrapper to html code */
    thisBooking.dom.wrapper.innerHTML = generatedHtml;

    /* find single element for people amount */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    //console.log('peopleAmount', thisBooking.dom.peopleAmount);
    /* find single element for hours amount */
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    //console.log('hoursAmount', thisBooking.dom.hoursAmount);
    //date and hrs selection task 10.3
    /* */
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    //console.log('thisBooking.dom.datePicker',thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    //console.log('thisBooking.dom',thisBooking.dom);
    //11.1
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);

    thisBooking.dom.tableSelected = thisBooking.dom.wrapper.querySelectorAll(select.booking.tableSelected);

    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    console.log('thisBooking.datePicker',thisBooking.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    //console.log('thisBooking.hourPicker',thisBooking.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

  }


  initActions(){
    const thisBooking = this;

    thisBooking.dom.form.addEventListener('submit',function(){
      event.preventDefault();
      thisBooking.sendOrder();
      thisBooking.dom.form.reset();
    });
  }

  initBoooking(){
    const thisBooking = this;
    thisBooking.selectedTable = [];

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function() {
        if (!table.classList.contains(classNames.booking.tableBooked)) {
          table.classList.toggle(classNames.booking.tableSelected);
          if (!table.classList.contains(classNames.booking.tableSelected)) {
            thisBooking.selectedTable.splice(thisBooking.selectedTable.indexOf(table.getAttribute(settings.booking.tableIdAttribute)), 0);
          } else {
            thisBooking.selectedTable.push(parseInt(table.getAttribute(settings.booking.tableIdAttribute)));
          }
        }
      });
    }

  }

  resetData(){
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.classList.remove(classNames.booking.tableSelected);
    }
    thisBooking.starters = [];
    thisBooking.selectedTable = [];
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }



  sendOrder(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      id: '',
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.selectedTable,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      starters: []
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked === true) {
        payload.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        thisBooking.getData();
        thisBooking.resetData();
      });
  }


}
export default Booking;
