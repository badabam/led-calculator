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
    'invest_led',
    'invest_old'
  ];

  var e = {};
  elementIds.forEach(function (id) {
    var el      = $('#' + id),
        isInput = el[0].localName === 'input';

    e[id] = isInput ? el.val.bind(el) : el.text.bind(el);
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
    elementIds.forEach(function(id) {
      var func = e[id];
      func(Math.round(func() * 100)/100);
    });
  }

// });
