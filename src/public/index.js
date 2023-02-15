// from create-label.js import formWithAlert_CreateLabel
// from label-list.js import LabelList, LabelListAlert, LabelItem

const pageTitle = m("h5").text("HuuTuu").addClass("display-5");
const pageSubtitle = m("p").text("糊塗記帳 ・ 難得糊塗").addClass(".lead");
const pageTitleArea = m("div")
  .append(pageTitle, pageSubtitle)
  .addClass("text-center");

$("#root").append(
  pageTitleArea.addClass("my-5"),
  formWithAlert_CreateLabel.addClass('my-3'),
  m(LabelList).addClass("my-3"),
  m(LabelListAlert).addClass("my-3")
);

init();

function init() {
  initLabels();
}

function initLabels() {
  axiosGet("/api/all-labels", LabelListAlert, (resp) => {
    const labels = resp.data;
    if (labels && labels.length > 0) {
      appendToList(LabelList, labels.map(LabelItem));
    } else {
      LabelListAlert.insert("info", "無預設標籤, 請新增標籤.");
    }
  });
}
