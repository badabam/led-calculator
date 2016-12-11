// $(function () {

  var elementIds = [
    'amount',
    'time',
    'days',
    'powerprice',
    'old_power',
    'old_initialcost',
    'old_endurance',
    // 'old_consumption',
    'new_power',
    'new_initialcost',
    'new_endurance',
    // 'new_consumption',
    'old_thousand_h_energy',
    'new_thousand_h_energy',
    'old_daily_energy',
    'new_daily_energy',
    'old_daily_cost',
    'new_daily_cost',
    'old_annual_cost',
    'new_annual_cost',
    'yearly_savings',
    'lifetime',
    'lifetime_saving',
    'result_time',
    'invest_led',
    'invest_old'
  ];

  var e = {}, textFields = [];
  elementIds.forEach(function (id) {
    var el      = $('#' + id),
        isInput = el[0].localName === 'input';

    if (isInput) {
      e[id] = function setVal(val) {
        if (val) {
          val = parseFloat(val.split(".").join(","));
          return el.val(val);
        } else {
          return el.val().toString().split(",").join(".");
        }
      };
    } else {
      e[id] = function setText(text) {
        if (text) {
          console.log("text", text);
          text = text.toString().split(".").join(",");
          return el.text(text);
        } else {
          return el.text().toString().split(",").join(".");
        }
      };
      textFields.push(e[id]);
    }
  });

  $(document).on('change keyup blur', 'input', calculate);
  calculate();

  // $('.ui.sticky').sticky();

  function calculate () {
    e.old_daily_energy(e.old_thousand_h_energy() * e.amount() * e.time() / 1000);
    e.new_daily_energy(e.new_thousand_h_energy() * e.amount() * e.time() / 1000);

    e.old_daily_cost(e.old_daily_energy() * e.powerprice() / 100);
    e.new_daily_cost(e.new_daily_energy() * e.powerprice() / 100);

    e.old_annual_cost(e.old_daily_cost() * e.days());
    e.new_annual_cost(e.new_daily_cost() * e.days());

    e.yearly_savings(e.old_annual_cost() - e.new_annual_cost());

    e.lifetime(e.new_endurance()/(e.time() * 365));
    e.lifetime_saving(e.lifetime()*e.yearly_savings());

    e.result_time(e.time());
    e.invest_led(e.old_initialcost() * e.amount());

    textFields.forEach(function(func) {
      var rounded = ( Math.round(func() * 100)/100 ).toString().split('.'),
          integer = rounded[0],
          decimal = rounded[1] || "00";

      decimal = decimal.length === 2 ? decimal : decimal + "0";
      console.log("num", integer + "," + decimal);
      func(integer + "," + decimal);
    });
  }

// });
