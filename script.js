$(function () {

  if (hasJakobi()) {
    var logo = document.getElementById('logo');
    logo.classList.add('hidden');
    logo.src = 'img/logo_jakobi.svg';
    logo.style.width = '26vw';
    logo.style.maxWidth = '370px';
    logo.style.minWidth = '200px';
    logo.style.padding = '1rem';
    logo.style.height = 'auto';
    logo.style.backgroundColor = 'white';

    var header = document.getElementById('header');
    header.style.backgroundColor = 'white';

    var heading = document.querySelector('.main-heading');
    heading.style.color = '#1678c2';
  }

  showHeader(); // always show header

  function hasJakobi () {
    return location.search.indexOf('jakobi') !== -1 ||
    location.hash.indexOf('jakobi') !== -1;
  }

  function showHeader() {
    var header = document.getElementById('header');
    var logo = document.getElementById('logo');

    setTimeout(function() {
      header.classList.remove('hidden');
      logo.classList.remove('hidden');
    }, 200);
  }


  var elementIds = [
    'amount',
    'time',
    'days',
    'powerprice',
    'old_power',
    'old_initialcost',
    'old_endurance',
    'new_power',
    'new_initialcost',
    'new_endurance',
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
      spanFuncs   = [],
      spans       = [],
      store       = {},
      startValues = {};

  elementIds.forEach(function (id) {
    var el      = $('#' + id),
        isInput = el[0].localName === 'input';

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
      spanFuncs.push(e[id]);
      spans.push(el);
    }
  });

  $('input').on('change keyup blur', onChange);

  $('[data-update]').on('click', function () {
    showLoading();
    hideAlert();
    resetOpacity();
    setTimeout(update, 250);
  });

  $('[data-reset]').on('click', reset);

  $(".print.icon").on("click", function () {
    window.print();
  });

  update();


  // *********************
  // FUNCTION DEFINITIONS
  // *********************

  function onChange(event) {
    var button = $('[data-update]'),
        target = $(event.target),
        hasEmptyValues = $('input').toArray().some(function (el) { return !el.value; });

    greyOutInfos();
    target.toggleClass('invalid', !target.val());
    button.prop('disabled', hasEmptyValues);
    button.toggleClass('disabled', hasEmptyValues);
    hasEmptyValues ? hideAlert() : showAlert();
  }

  function hideAlert () {
    $('.alert').addClass('no-display');
  }

  function showAlert () {
    $('.alert').removeClass('no-display');
  }

  function showLoading () {
    $('[data-update]').addClass('loading');
  }

  function hideLoading () {
    $('[data-update]').removeClass('loading');
  }

  function greyOutInfos (event) {
    showAlert();
    spans.forEach(function (el) {
      el.addClass('grey');
      el.removeClass('fade');
    });
  }

  function resetOpacity() {
    spans.forEach(function (el) {
      el.removeClass('grey');
      el.addClass('fade');
    });
  }

  function update () {
    hideLoading();
    calculate();
    store = save();
  }

  function reset () {
    load();
    resetOpacity();
    hideAlert();
  }

  function save () {
    var result = {};
    elementIds.forEach(function (id) {
      result[id] = e[id]();
    });
    return result;
  }

  function load () {
    Object.keys(store).forEach(function (id) {
      e[id](store[id]);
    });
  }

  function calculate () {
    e.old_thousand_h_energy(e.old_power());
    e.new_thousand_h_energy(e.new_power());
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

    spanFuncs.forEach(function(func) {
      var rounded = ( Math.round(func() * 100)/100 ).toString().split('.'),
          integer = rounded[0],
          decimal = rounded[1] || '00';

      decimal = decimal.length === 2 ? decimal : decimal + '0';
      func(integer + ',' + decimal);
    });
  }

});
