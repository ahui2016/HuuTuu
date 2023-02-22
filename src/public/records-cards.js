const navBar = m("div")
  .addClass("row")
  .append(
    m("div")
      .addClass("col text-start")
      .append(
        createLinkElem("index.html", { text: "HuuTuu" }),
        span(" .. 流水帳(卡片))")
      ),
    m("div")
      .addClass("col text-end")
      .append(
        createLinkElem("records-list.html", { text: "List" }),
        " | ",
        createLinkElem("records-days.html", { text: "Days" }),
        " | ",
        createLinkElem("records-months.html", { text: "Months" }),
        " | ",
        createLinkElem("records-years.html", { text: "Years" })
      )
  );

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

  const recordTime = dayjs.unix(record.dt).format("YYYY-MM-DD HH:mm:ss");

  return cc("div", {
    id: `R-${record.id}`,
    attr: { "data-id": record.id },
    classes: "RecordCard card border-secondary mx-auto mb-5",
    css: { maxWidth: "38rem" },
    children: [
      m("div")
        .addClass("card-body text-dark")
        .append(
          m("div").addClass("card-title fs-3").text(record.label.name),
          m("p").addClass("RecordNotes text-muted").text(record.notes),
          m("p").addClass("card-text fs-4 fw-bold").text(`￥${record.amount}`),
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
  navBar.addClass("my-3"),
  m(RecordCardsAlert).addClass("my-3"),
  m(RecordCardsList).addClass("my-3")
);

init();

async function init() {
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
          .addClass("card-img-top")
          .attr({ src: photoURL, alt: photoURL }))
      );
    }
  });
}
