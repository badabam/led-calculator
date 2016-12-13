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
    'invest_old',
    'num_old',
    'cent_a_day',
    'euro_a_year',
    'result_days',
    'years_to_amortise',
    'lifetime_copy',
    'total_kwh'
  ];

  var e           = {},
      elements    = [],
      textFields  = [],
      savedValues = {};

  elementIds.forEach(function (id) {
    var el      = $('#' + id),
        isInput = el[0].localName === 'input';

    elements.push(el);

    if (isInput) {
      e[id] = function setVal(val) {
        if (val) {
          val = parseFloat(val.split('.').join(','));
          return el.val(val);
        } else {
          return el.val().toString().split(',').join('.');
        }
      };
    } else {
      e[id] = function setText(text) {
        if (text) {
          text = text.toString().split('.').join(',');
          return el.text(text);
        } else {
          return el.text().toString().split(',').join('.');
        }
      };
      textFields.push(e[id]);
    }
  });

  $('input').on('change keyup blur',  greyOutInfos);

  $('[data-update]').on('click', function () {
    hideAlert();
    resetOpacity();
    setTimeout(update, 250);
  });

  $('[data-reset]').on('click', reset);

  update();

  // $('.ui.sticky').sticky();

  function hideAlert () {
    $('.alert').addClass('no-display');
  }

  function showAlert () {
    $('.alert').removeClass('no-display');
  }

  function greyOutInfos (event) {
    showAlert();
    elements.forEach(function (el) {
      if (el !== $(event.target)) {
        el.addClass('grey');
        el.removeClass('fade');
      }
    });
  }

  function resetOpacity() {
    elements.forEach(function (el) {
      el.removeClass('grey');
      el.addClass('fade');
    });
  }

  function update () {
    calculate();
    save();
  }

  function reset () {
    load();
    resetOpacity();
    hideAlert();
  }

  function save () {
    savedValues = {};
    elementIds.forEach(function (id) {
      savedValues[id] = e[id]();
    });
  }

  function load () {
    Object.keys(savedValues).forEach(function (id) {
      e[id](savedValues[id]);
    });
  }

  function calculate () {
    e.old_daily_energy(e.old_thousand_h_energy() * e.amount() * e.time() / 1000);
    e.new_daily_energy(e.new_thousand_h_energy() * e.amount() * e.time() / 1000);

    e.old_daily_cost(e.old_daily_energy() * e.powerprice() / 100);
    e.new_daily_cost(e.new_daily_energy() * e.powerprice() / 100);

    e.old_annual_cost(e.old_daily_cost() * e.days());
    e.new_annual_cost(e.new_daily_cost() * e.days());

    e.yearly_savings(e.old_annual_cost() - e.new_annual_cost());

    e.lifetime( e.new_endurance() / (e.time() * 365) );
    e.lifetime_saving(e.lifetime() * e.yearly_savings());

    e.result_time(e.time());
    e.invest_led(e.new_initialcost() * e.amount());
    e.cent_a_day( (e.old_daily_cost() - e.new_daily_cost()) * 100 );
    e.euro_a_year( (e.cent_a_day() * e.days()) / 100 );
    e.result_days( e.days() );
    e.years_to_amortise( e.amount() * e.new_initialcost()/e.euro_a_year());
    e.total_kwh( (e.old_daily_energy() - e.new_daily_energy()) * e.days() * e.years_to_amortise() );

    textFields.forEach(function(func) {
      var rounded = ( Math.round(func() * 100)/100 ).toString().split('.'),
          integer = rounded[0],
          decimal = rounded[1] || '00';

      decimal = decimal.length === 2 ? decimal : decimal + '0';
      func(integer + ',' + decimal);
    });
  }

// });
