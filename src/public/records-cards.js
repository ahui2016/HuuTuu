const day = getUrlParam("day");
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
  MJBS.createLinkElem("records-list.html", { text: "List" }).addClass(
    "ListLink"
  ),
  " | ",
  MJBS.createLinkElem("records-days.html", { text: "Days" }),
  " | ",
  MJBS.createLinkElem("records-months.html", { text: "Months" }),
  " | ",
  MJBS.createLinkElem("records-years.html", { text: "Years" })
);

const pageTitleArea = m("div")
  .addClass("text-center")
  .append(pageTitle, pageSubtitle, pageNavBar);

const IDToasts = MJBS.createToasts(
  "toast-container position-fixed top-50 start-50 translate-middle"
);
$("#root").append(m(IDToasts));
const IDToast = IDToasts.new();

const RecordCardsAlert = MJBS.createAlert();
const PageNav = MJBS.createSimplePageNav("lg", "center");

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

  const recordTime = dayjs.unix(record.dt).format(DateFormatYMD);

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

$("#root").append(
  pageTitleArea.addClass("my-5"),
  m(RecordCardsAlert).addClass("my-5 mx-auto").css({ maxWidth: maxWidth }),
  m(RecordCardsList).addClass("my-5"),
  m(PageNav).addClass("my-5").hide()
);

init();

async function init() {
  let url = "/api/all-records";

  if (day) {
    RecordCardsAlert.insert("secondary", `正在展示 ${day} 一天的帳目`, "");
    url = `/api/records-by-day?day=${day}`;
    $(".ListLink").attr({ href: `records-list.html?day=${day}` });
    showPageNav_by_day(day, PageNav);
  } else {
    RecordCardsAlert.insert("info", `正在展示最近的帳目`);
  }

  await initRecordCards(url);
  const photos = await getPhotos();
  initPhotos(photos);
}

function initRecordCards(url) {
  return new Promise((resolve) => {
    axiosGet({
      url: url,
      alert: RecordCardsAlert,
      onSuccess: (resp) => {
        const records = resp.data;
        if (records && records.length > 0) {
          MJBS.appendToList(RecordCardsList, records.map(RecordCardItem));
          const today = dayjs.unix(records[0].dt).format(DateFormatYMD);
          const amountSum = records.reduce(
            (acc, record) => acc + record.amount,
            0
          );
          if (day) {
            RecordCardsAlert.insert(
              "light",
              `${today} 合計: ${amountSum} 圓`,
              ""
            );
          }
        } else {
          RecordCardsAlert.insert("info", "未找到相關數據");
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
        m("img")
          .addClass("card-img-top img-thumbnail")
          .attr({ src: photoURL, alt: photoURL })
      );
    }
  });
}
