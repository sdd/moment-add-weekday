(function () {
  var moment;

  if (typeof require === "function") {
    moment = require('moment');
  } else {
    moment = this.moment;
  }
  
  var origAdd = moment.fn.add;
  var origSubtract = moment.fn.subtract;
  
  var newAdd = function(val, period) {
    if (period.toLowerCase() === 'weekdays' || period.toLowerCase() === 'weekday' || period.toLowerCase() === 'wd') {
      return addWeekDays.call(this, val);
    } else {
      return origAdd.call(this, val, period);
    }
  }
  
  var newSubtract = function(val, period) {
    return newAdd(0 - val, period);
  }
  
  moment.fn.add = newAdd;
  moment.fn.subtract = newSubtract;
  
  function addWeekDays(numWeekdaysToAdd) {
  
    var offset = Number(numWeekdaysToAdd);
    if (!Number.isFinite(offset)) {
        throw new Error('number of weekdays integer expected');
    }
  
    var dayOfWeek = this.day();

    var wholeWeeksToAdd = Math.floor(Math.abs(offset) / 5) * Math.sign(offset);
    var surplusWeekdaysToAdd = offset % 5;

    let weekendWrapAdjustment = 0;
    if (surplusWeekdaysToAdd !== 0) {
        if (dayOfWeek + surplusWeekdaysToAdd < 1) {

            // going back to before a weekend? subtract extra two
            // days. Unless from sunday, in which case sub extra 1.
            weekendWrapAdjustment = dayOfWeek > 0 ? -2 : -1;
        } else if (dayOfWeek + surplusWeekdaysToAdd > 5) {

            // going forward to after a weekend? add extra two
            // days. Unless from saturday, in which case add extra 1.
            weekendWrapAdjustment = dayOfWeek < 6 ? 2 : 1;
        }
    }

    return origAdd.call(this,
      (wholeWeeksToAdd * 7) + surplusWeekdaysToAdd + weekendWrapAdjustment,
      'days'
    );
  }
})
