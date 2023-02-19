// 这些 class 只是为了方便生成文档，不实际使用。
class RecordWithLabel {}

const navBar = m("div")
  .addClass("row")
  .append(
    m("div")
      .addClass("col text-start")
      .append(
        createLinkElem("index.html", { text: "HuuTuu" }),
        span(" .. Items (流水帳)")
      ),
    m("div")
      .addClass("col text-end")
      .append(
        createLinkElem("records-days.html", { text: "Days" }),
        " | ",
        createLinkElem("records-months.html", { text: "Months" }),
        " | ",
        createLinkElem("records-years.html", { text: "Years" })
      )
  );

const IDToasts = createToasts();
$("#root").append(m(IDToasts));
// IDToasts.elem().addClass("top-50 start-50 translate-middle");
const IDToast = IDToasts.new();

/**
 * @param {RecordWithLabel} record
 * @returns {mjComponent}
 */
function RecordItemsTableRow(record) {
  const label = m("div").addClass("text-nowrap").text(record.label.name);

  if (record.notes) {
    label.append(span(record.notes).addClass("text-muted ms-2"));
  }

  const IDBtn = cc("a", {
    text: "🆔",
    attr: { href: "#", title: record.id },
    classes: "text-decoration-none ms-1",
  });

  return cc("tr", {
    children: [
      m("td")
        .attr({ "data-id": record.id })
        .addClass("ID-Column text-nowrap")
        .append(
          dayjs.unix(record.dt).format("YYYY-MM-DD"),
          m(IDBtn).on("click", () => {
            copyToClipboard2(
              record.id,
              () => {
                IDToast.popup(
                  m("p")
                    .text(`Record ID: ${record.id} 己複製至剪貼簿`)
                    .addClass("mt-3 mb-5 text-center"),
                  "Copied! (複製成功!)",
                  "success"
                );
              },
              () => {
                IDToast.popup(
                  m("p")
                    .text(`Record ID: ${record.id} 複製失敗`)
                    .addClass("mt-3 mb-5 text-center"),
                  "Failed! (複製失敗!)",
                  "danger"
                );
              }
            );
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
  navBar.addClass("my-3"),
  // m(IDToasts),
  m(RecordItemsAlert).addClass("my-3"),
  m(RecordItemsTable).addClass("my-3")
);

init();

async function init() {
  await initRecordItems();
  const photos = await getPhotos();
  initPhotos(photos);
}

function initRecordItems() {
  return new Promise((resolve) => {
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
        resolve();
      },
    });
  });
}

function getPhotos() {
  return new Promise((resolve) => {
    axiosGet({
      url: "/api/all-photos",
      alert: RecordItemsAlert,
      onSuccess: (resp) => {
        resolve(resp.data);
      },
    });
  });
}

function initPhotos(photos) {
  $(".ID-Column").each(function() {
    data_id = $(this).attr("data-id");
    id = parseInt(data_id);
    if (id in photos) {
      const PhotoBtn = cc("a", {
        text: "🖼️",
        attr: { href: "#", title: "photo", target: "_blank" },
        classes: "text-decoration-none",
      });
      $(this).append(m(PhotoBtn).attr({ href: `photos/${id}${photos[id]}` }));
    }
  })
}

function moneyBar(amount) {
  let i = predefinedAmounts.indexOf(amount);
  if (i < 0) i = 0;
  if (i > 15) i = 15;
  return "▊".repeat(i);
}
