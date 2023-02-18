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
      RecordArea.elem().find('.text-muted').hide();
      const cardText = RecordArea.elem().find('.card-text');
      cardText.show().text(`￥${val}`);
      window["my-record"].amount = amount;
      StepTwo.elem().fadeOut({
        complete: () => {
          StepThree.show();
          focus(NotesInput);
        },
      });
    });
  };

  return self;
}

const MoneyList = cc("div", { classes: 'd-flex flex-wrap gap-3' });

MoneyList.init = () => {
  appendToList(MoneyList, predefinedAmounts.map(MoneyItem));
};

const StepTwo = cc('div', {
  children: [
    m('h3').text('Step Two (第二步)'),
    m('p').text('請點撃金額 (四捨五入)').addClass("my-3"),
    m(MoneyList).addClass("my-3"),
  ]
});
