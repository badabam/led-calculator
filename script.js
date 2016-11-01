// $(function () {

  var elementIds = [
    'amount',
    'time',
    'days',
    'powerprice',
    'old_power',
    'old_initialcost',
    'old_endurance',
    'old_consumption',
    'new_power',
    'new_initialcost',
    'new_endurance',
    'new_consumption',
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

  var els = {};
  elementIds.forEach(function (id) {
    var el      = $('#' + id),
        isInput = el[0].localName === 'input';

    els[id] = isInput ? el.val.bind(el) : el.text.bind(el);
  });

  $(document).on('change keyup blur', 'input', calculate);
  calculate();

  // $('.ui.sticky').sticky();

  function calculate () {
    els.old_daily_energy(els.old_thousand_h_energy() * els.amount() * els.time() / 1000);
    els.new_daily_energy(els.new_thousand_h_energy() * els.amount() * els.time() / 1000);

    els.old_daily_cost(els.old_daily_energy() * els.powerprice() / 100);
    els.new_daily_cost(els.new_daily_energy() * els.powerprice() / 100);

    els.old_annual_cost(els.old_daily_cost() * els.days());
    els.new_annual_cost(els.new_daily_cost() * els.days());

    els.yearly_savings(els.old_annual_cost() - els.new_annual_cost());
  }

// });
