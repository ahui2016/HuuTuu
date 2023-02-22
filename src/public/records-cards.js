const maxWidth = "38rem";

const pageTitle = m("h5")
  .text("HuuTuu")
  .addClass("display-5")
  .css({ cursor: "pointer" })
  .on("click", () => {
    window.location = "index.html";
  });
const pageSubtitle = m("p").text("糊塗記帳 ・ 難得糊塗").addClass(".lead");
const pageNavBar = m("div").append(
  createLinkElem("records-list.html", { text: "List" }).addClass("ListLink"),
  " | ",
  createLinkElem("records-days.html", { text: "Days" }),
  " | ",
  createLinkElem("records-months.html", { text: "Months" }),
  " | ",
  createLinkElem("records-years.html", { text: "Years" })
);

const pageTitleArea = m("div")
  .addClass("text-center")
  .append(pageTitle, pageSubtitle, pageNavBar);

const IDToasts = createToasts(
  "toast-container position-fixed top-50 start-50 translate-middle"
);
$("#root").append(m(IDToasts));
const IDToast = IDToasts.new();

/**
 * @param {RecordWithLabel} record
 * @returns {mjComponent}
 */
function RecordCardItem(record) {
  const IDBtn = cc("a", {
    text: "🆔",
    attr: { href: "#", title: record.id },
    classes: "text-decoration-none ms-1",
  });

  const recordTime = dayjs.unix(record.dt).format("YYYY-MM-DD");

  return cc("div", {
    id: `R-${record.id}`,
    attr: { "data-id": record.id },
    classes: "RecordCard card text-bg-light mx-auto mb-5",
    css: { maxWidth: maxWidth },
    children: [
      m("div")
        .addClass("card-body text-dark")
        .append(
          m("div")
            .addClass("row fs-4 fw-bold")
            .append(
              m("div")
                .addClass("card-title col text-start")
                .text(record.label.name),
              m("p")
                .addClass("card-text col text-end")
                .text(`￥${record.amount}`)
            ),
          m("p").addClass("RecordNotes text-muted").text(record.notes),
          m("div")
            .addClass("RecordTime text-end")
            .append(
              recordTime,
              m(IDBtn).on("click", (event) => {
                event.preventDefault();
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
            )
        ),
    ],
  });
}

const RecordCardsList = cc("div");

const RecordCardsAlert = createAlert();

$("#root").append(
  pageTitleArea.addClass("my-5"),
  m(RecordCardsAlert).addClass("my-5 mx-auto").css({ maxWidth: maxWidth }),
  m(RecordCardsList).addClass("my-5")
);

init();

async function init() {
  const day = getUrlParam("day");
  let url = "/api/all-records";

  if (day) {
    RecordCardsAlert.insert("info", `正在展示 ${day} 一天的帳目`);
    url = `/api/records-by-day?day=${day}`;
    $(".ListLink").attr({ href: `records-list.html?day=${day}` });
  } else {
    RecordCardsAlert.insert("info", `正在展示最近的帳目`);
  }

  await initRecordCards();
  const photos = await getPhotos();
  initPhotos(photos);
}

function initRecordCards() {
  return new Promise((resolve) => {
    axiosGet({
      url: "/api/all-records",
      alert: RecordCardsAlert,
      onSuccess: (resp) => {
        const records = resp.data;
        if (records && records.length > 0) {
          appendToList(RecordCardsList, records.map(RecordCardItem));
        } else {
          RecordCardsAlert.insert("info", "暫無數據");
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
      alert: RecordCardsAlert,
      onSuccess: (resp) => {
        resolve(resp.data);
      },
    });
  });
}

function initPhotos(photos) {
  $(".RecordCard").each(function () {
    const data_id = $(this).attr("data-id");
    const id = parseInt(data_id);
    if (id in photos) {
      const photoURL = `photos/${id}${photos[id]}`;
      $(this).prepend(
        (img = m("img")
          .addClass("card-img-top img-thumbnail")
          .attr({ src: photoURL, alt: photoURL }))
      );
    }
  });
}
