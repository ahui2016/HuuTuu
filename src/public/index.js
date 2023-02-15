/*
from step-one.js import (
  FormArea_CreateLabel, LabelNameInput, LabelList, LabelItem, StepOne
)
*/

const pageTitle = m("h5").text("HuuTuu").addClass("display-5");
const pageSubtitle = m("p").text("糊塗記帳 ・ 難得糊塗").addClass(".lead");
const pageTitleArea = m("div")
  .append(pageTitle, pageSubtitle)
  .addClass("text-center");

const AppAlert = createAlert();

$("#root").append(
  pageTitleArea.addClass("my-5"),
  m(AppAlert).add('my-3'),
  m(StepOne).addClass('my-3'),
);

init();

function init() {
  initLabels();
}

function initLabels() {
  axiosGet("/api/all-labels", AppAlert, (resp) => {
    const labels = resp.data;
    if (labels && labels.length > 0) {
      appendToList(LabelList, labels.map(LabelItem));
    } else {
      AppAlert.insert("info", "無預設標籤, 請新增標籤.");
      FormArea_CreateLabel.show();
      focus(LabelNameInput);
    }
  });
}
