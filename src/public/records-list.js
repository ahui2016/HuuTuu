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
        createLinkElem("records-cards.html", { text: "Cards" }).addClass(
          "CardsLink"
        ),
        " | ",
        createLinkElem("records-days.html", { text: "Days" }),
        " | ",
        createLinkElem("records-months.html", { text: "Months" }),
        " | ",
        createLinkElem("records-years.html", { text: "Years" })
      )
  );

const IDToasts = createToasts();
// const IDToasts = createToasts("toast-container position-fixed top-50 start-50 translate-middle");
$("#root").append(m(IDToasts));
const IDToast = IDToasts.new();

/**
 * @param {RecordWithLabel} record
 * @returns {mjComponent}
 */
function RecordItemsTableRow(record) {
  const label = m("div")
    .addClass("text-nowrap")
    .append(span(record.label.name).addClass("RecordLabel"));

  if (record.notes) {
    label.append(span(record.notes).addClass("RecordNotes text-muted ms-2"));
  }

  const IDBtn = cc("a", {
    text: "🆔",
    attr: { href: "#", title: record.id },
    classes: "text-decoration-none ms-1",
  });

  return cc("tr", {
    id: `R-${record.id}`,
    children: [
      m("td")
        .attr({ "data-id": record.id })
        .addClass("ID-Column text-nowrap")
        .append(
          span(dayjs.unix(record.dt).format("YYYY-MM-DD")).addClass(
            "RecordDate"
          ),
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
const RecordItemsModal = createModal("lg");

$("#root").append(
  navBar.addClass("my-3"),
  m(RecordItemsModal),
  m(RecordItemsAlert).addClass("my-3"),
  m(RecordItemsTable).addClass("my-3")
);

init();

async function init() {
  const day = getUrlParam("day");
  let url = "/api/all-records";

  if (day) {
    RecordItemsAlert.insert("info", `正在展示 ${day} 一天的帳目`);
    url = `/api/records-by-day?day=${day}`;
    $('.CardsLink').attr({href: `records-cards.html?day=${day}`});
  } else {
    RecordItemsAlert.insert("info", `正在展示最近的帳目`);
  }

  await initRecordItems(url);
  const photos = await getPhotos();
  initPhotos(photos);
}

function initRecordItems(url) {
  return new Promise((resolve) => {
    axiosGet({
      url: url,
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
  $(".ID-Column").each(function () {
    const data_id = $(this).attr("data-id");
    const id = parseInt(data_id);
    if (id in photos) {
      const recordElem = $(`#R-${id}`);
      const label = recordElem.find(".RecordLabel").text();
      const notes = recordElem.find(".RecordNotes").text();
      const date = recordElem.find(".RecordDate").text();
      const photoURL = `photos/${id}${photos[id]}`;
      const img = m("img")
        .addClass("img-fluid")
        .attr({ src: photoURL, alt: photoURL });
      const PhotoBtn = cc("a", {
        text: "🖼️",
        attr: { href: "#", title: "photo" },
        classes: "text-decoration-none",
      });
      $(this).append(
        m(PhotoBtn).on("click", () => {
          RecordItemsModal.popup(`${label} (${notes})`, img, `Date: ${date}`);
        })
      );
    }
  });
}

function moneyBar(amount) {
  let i = predefinedAmounts.indexOf(amount);
  if (i < 0) i = 0;
  if (i > 15) i = 15;
  return "▊".repeat(i);
}
