/**
 * @param {number} amount
 * @returns {mjComponent}
 */
function MoneyItem(amount) {
  const val = amount.toFixed();
  const self = cc("button", {
    id: elemID(val, "amount"),
    text: val,
    attr: {type: 'button'},
    classes: "btn btn-outline-success",
  });

  self.init = () => {
    self.elem().on("click", (event) => {
      event.preventDefault();
    });
  };

  return self;
}

const MoneyList = cc("div", { classes: 'd-flex flex-wrap gap-3' });

const amounts = [
  0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90,
  100, 150, 200, 300, 400, 500, 600, 700, 800, 900,
  1000, 1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
  10000
];

MoneyList.init = () => {
  appendToList(MoneyList, amounts.map(MoneyItem));
};

const StepTwo = cc('div', {
  children: [
    m('h3').text('Step Two (第二步)'),
    m('p').text('請點撃金額 (四捨五入)').addClass("my-3"),
    m(MoneyList).addClass("my-3"),
  ]
});
