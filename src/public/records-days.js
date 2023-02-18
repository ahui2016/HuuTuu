const pageTitle = m("h5").text("HuuTuu").addClass("display-5");
const pageSubtitle = m("p").text("糊塗記帳 ・ 難得糊塗").addClass(".lead");
const pageTitleArea = m("div")
  .append(pageTitle, pageSubtitle)
  .addClass("text-center");

function DaysTableRow(dateAmount) {
  const labels = dateAmount.labels.join(', ');
  return cc("tr", {
    children: [
      m("td").text(dateAmount.date),
      m("td").text(`${moneyBar(dateAmount.amount)}(￥${dateAmount.amount})`),
      m("td").append(labels).addClass('text-nowrap'),
    ],
  });
}

const DaysTableBody = cc("tbody");

const DaysTable = cc("table", {
  classes: "table font-monospace",
  children: [m(DaysTableBody)],
});

const DaysTableAlert = createAlert();

$("#root").append(
  pageTitleArea.addClass("my-5"),
  m(DaysTableAlert).addClass("my-3"),
  m(DaysTable).addClass("my-3")
);

init();

function init() {
  initRecordItems();
}

function initRecordItems() {
  axiosGet({
    url: "/api/records-days",
    alert: DaysTableAlert,
    onSuccess: (resp) => {
      const data = resp.data;
      if (data && data.length > 0) {
        appendToList(DaysTableBody, data.map(DaysTableRow));
      } else {
        DaysTableAlert.insert("info", "暫無數據");
      }
    },
  });
}

function moneyBar(amount) {
  if (amount == 0) return '';
  let i = Math.round(amount/20); // 以 300 元為上限, 300/15=20
  if (i > 15) i = 15;
  return "▊".repeat(i);
}
