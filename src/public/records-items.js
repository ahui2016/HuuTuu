// 这些 class 只是为了方便生成文档，不实际使用。
class RecordWithLabel {}

const navBar = m("div").addClass('row').append(
  m('div').addClass('col text-start').append(
    createLinkElem("index.html", { text: "HuuTuu" }),
    span(" .. Items (流水帳)")  
  ),
  m("div").addClass('col text-end').append(
    createLinkElem("records-days.html", { text: "Days" }),
    " | ",
    createLinkElem("records-months.html", { text: "Months" }),
    " | ",
    createLinkElem("records-years.html", { text: "Years" })
  )
);

const IDToasts = createToasts();
const IDToast = IDToasts.new();
IDToast.setTitle('Record ID');

/**
 * @param {RecordWithLabel} record
 * @returns {mjComponent}
 */
function RecordItemsTableRow(record) {
  const label = m("div").addClass("text-nowrap").text(record.label.name);

  if (record.notes) {
    label.append(span(record.notes).addClass("text-muted ms-2"));
  }

  const IDBtn = createButton('🆔', 'link');

  return cc("tr", {
    children: [
      m("td").append(
        dayjs.unix(record.dt).format("YYYY-MM-DD"),
        m(IDBtn).on('click', () => {
          IDToast.popup(record.id);
        })
      ),
      m("td").text(`${moneyBar(record.amount)}(￥${record.amount})`),
      m("td").append(label),
    ],
  });
}

const RecordItemsTableBody = cc("tbody");

const RecordItemsTable = cc("table", {
  classes: "table font-monospace",
  children: [m(RecordItemsTableBody)],
});

const RecordItemsAlert = createAlert();

$("#root").append(
  navBar.addClass('my-3'),
  m(IDToasts),
  m(RecordItemsAlert).addClass("my-3"),
  m(RecordItemsTable).addClass("my-3")
);

init();

function init() {
  initRecordItems();
}

function initRecordItems() {
  axiosGet({
    url: "/api/all-records",
    alert: RecordItemsAlert,
    onSuccess: (resp) => {
      const records = resp.data;
      if (records && records.length > 0) {
        appendToList(RecordItemsTableBody, records.map(RecordItemsTableRow));
      } else {
        RecordItemsAlert.insert("info", "暫無數據");
      }
    },
  });
}

function moneyBar(amount) {
  let i = predefinedAmounts.indexOf(amount);
  if (i < 0) i = 0;
  if (i > 15) i = 15;
  return "▊".repeat(i);
}
