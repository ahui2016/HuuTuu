/*
from step-one.js import (
  FormArea_CreateLabel, LabelNameInput, LabelList, LabelItem, StepOne
)
*/

// 對應後端的 forms.RecordCreate
window["my-record"] = {
  amount: null,
  note: null,
  label_id: null,
};

const pageTitle = m("h5").text("HuuTuu").addClass("display-5");
const pageSubtitle = m("p").text("糊塗記帳 ・ 難得糊塗").addClass(".lead");
const pageTitleArea = m("div")
  .append(pageTitle, pageSubtitle)
  .addClass("text-center");

const AppSubmitBtn = createButton("submit", "primary");
const AppCancelBtn = createButton("cancel", "secondary");
const AppReloadBtn = createButton('再記一筆', 'success');

const RecordArea = cc("div", {
  classes: "card border-secondary mx-auto",
  attr: { style: "max-width: 28rem;" },
  children: [
    m("div")
      .addClass("card-body text-dark")
      .append(
        m("h4").addClass("card-title"),
        m("p").addClass("RecordNotes text-muted").hide(),
        m("p").addClass("text-muted").text("第二步: 請選擇金額"),
        m("p").addClass("card-text fs-4 fw-bold").hide(),
        m("div")
          .addClass("text-end")
          .append(
            m(AppSubmitBtn) // ---> ---> ---> ---> Create Record Button
              .addClass("me-1")
              .on("click", (event) => {
                event.preventDefault();
                axiosPost({
                  url: "/api/create-record",
                  body: window["my-record"],
                  alert: AppAlert,
                  onSuccess: (resp) => {
                    const record = resp.data;
                    AppAlert.insert(
                      "success",
                      `成功創建 Record(id:${record.id}) ${record.label.name} ￥${record.amount}`
                    );
                    AppSubmitBtn.hide();
                    AppCancelBtn.hide();
                    AppReloadBtn.show();
                    StepThree.elem().fadeOut();
                  },
                });
              }),
            m(AppCancelBtn).on("click", (event) => {
              event.preventDefault();
              RecordArea.elem().fadeOut("fast");
              StepTwo.elem().fadeOut('fast');
              StepThree.elem().fadeOut("fast", () => {
                window.location.reload();
              });
            }),
            m(AppReloadBtn).on('click', event => {
              event.preventDefault();
              AppAlert.elem().fadeOut();
              RecordArea.elem().fadeOut({complete: () => {
                window.location.reload();
              }});
            }).hide()
          )
      ),
  ],
});

const AppAlert = createAlert();

$("#root").append(
  pageTitleArea.addClass("my-5"),
  m(RecordArea).addClass("my-5").hide(),
  m(AppAlert).addClass("my-3"),
  m(StepOne).addClass("my-3"),
  m(StepTwo).addClass("my-3").hide(),
  m(StepThree).addClass("my-3").hide(),
  m('p').addClass('text-end my-5').append(
    createLinkElem('record-items.html', {text:'Items'})
  ),
);

init();

function init() {
  initLabels();
  MoneyList.init();
  NotesList.init();
}

function initLabels() {
  axiosGet({
    url: "/api/all-labels",
    alert: AppAlert,
    onSuccess: (resp) => {
      const labels = resp.data;
      if (labels && labels.length > 0) {
        appendToList(LabelList, labels.map(LabelItem));
      } else {
        AppAlert.insert("info", "無預設標籤, 請新增標籤.");
        FormArea_CreateLabel.show();
        focus(LabelNameInput);
      }
    },
  });
}
