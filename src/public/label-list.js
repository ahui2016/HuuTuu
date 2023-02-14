const LabelList = cc("div", {classes: 'd-flex gap-3'});
const LabelListAlert = createAlert();

/**
 * @param {Label} label
 * @returns {mjComponent}
 */
function LabelItem(label) {
  const self = cc("button", {
    id: elemID(label.id, "label"),
    text: label.name,
    classes: "btn rounded-pill btn-primary",
  });

  // const self = cc('div', { children: [m(Item)] })

  self.init = () => {
    self.elem().on("click", (event) => {
      event.preventDefault();
    });
  };

  return self;
}
