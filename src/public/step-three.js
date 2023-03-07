const predefinedNotes = [
  "這些是常用備註",
  "點擊常用備註方便輸入",
  "你可以自定義常用備註",
  "早餐",
  "麥當勞",
  "大家樂",
  "美團外賣會員",
  "物業管理費",
];

const NotesInput = MJBS.createInput("text");
const SetNotesBtn = MJBS.createButton("Enter", "primary");

const Form_Notes = cc("form", {
  attr: { autocomplete: "off" },
  children: [
    m("div")
      .addClass("input-group input-group-lg")
      .append(
        // label
        m("span").addClass("input-group-text").text("Notes"),

        // text input
        m(NotesInput)
          .addClass("form-control")
          .attr({ placeholder: "在此填寫備註, 建議盡量簡短" }),

        // submit button
        m(SetNotesBtn)
          .attr({ type: "submit" })
          .on("click", (event) => {
            event.preventDefault();
            const notes = MJBS.valOf(NotesInput, "trim");
            RecordArea.find(".RecordNotes").show().text(notes);
            MJBS.focus(NotesInput);
            window["my-record"].notes = notes;
          })
      ),
  ],
});

/**
 * @param {string} text
 * @returns {mjComponent}
 */
function NotesItem(text) {
  const self = MJBS.createButton(text, "light");

  self.init = () => {
    self.elem().on("click", (event) => {
      event.preventDefault();
      let notes = MJBS.valOf(NotesInput);
      notes = `${notes} ${text}`;
      NotesInput.elem().val(notes.trimStart());
      MJBS.focus(NotesInput);
    });
  };

  return self;
}

const NotesList = cc("div", { classes: "d-flex flex-wrap gap-3" });

NotesList.init = () => {
  MJBS.appendToList(NotesList, predefinedNotes.map(NotesItem));
};

const StepThree = cc("div", {
  children: [
    m("h3").text("Final Step (最後一步)"),
    m("ul").append(
      m("li").text("你可不輸入備註, 現在按 Submit 按鈕完成一筆記帳"),
      m("li").text("也可輸入備註, 按 Enter 設置備註後再按 Submit 提交表單"),
      m("li").append(
        MJBS.span("設置常用備註的方法詳見 "),
        MJBS.createLinkElem("https://github.com/ahui2016/HuuTuu", {
          text: "github.com/ahui2016/HuuTuu",
          blank: true,
        })
      )
    ),
    m(Form_Notes).addClass("my-3"),
    m(NotesList).addClass("my-3"),
  ],
});
