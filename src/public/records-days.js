const navBar = m("div").addClass('row').append(
  m('div').addClass('col text-start').append(
    createLinkElem("index.html", { text: "HuuTuu" }),
    span(" .. Days (每日支出)")  
  ),
  m("div").addClass('col text-end').append(
    createLinkElem("records-list.html", { text: "List" }),
    " | ",
    createLinkElem("records-months.html", { text: "Months" }),
    " | ",
    createLinkElem("records-years.html", { text: "Years" })
  )
);

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
  navBar.addClass("my-3"),
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
