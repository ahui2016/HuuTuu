const predefinedNotes = [
  "這些是常用備註",
  "點擊常用備註方便輸入",
  "你可以自定義常用備註",
];

const NotesInput = createInput("text");
const SetNotesBtn = createButton("Enter", "primary");

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
            const notes = valOf(NotesInput, "trim");
            RecordArea.elem().find(".RecordNotes").show().text(notes);
            focus(NotesInput);
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
  const self = createButton(text, "light");

  self.init = () => {
    self.elem().on("click", (event) => {
      event.preventDefault();
      let notes = valOf(NotesInput);
      notes = `${notes} ${text}`;
      NotesInput.elem().val(notes);
      focus(NotesInput);
    });
  };

  return self;
}

const NotesList = cc("div", { classes: "d-flex flex-wrap gap-3" });

NotesList.init = () => {
  appendToList(NotesList, predefinedNotes.map(NotesItem));
};

const StepThree = cc("div", {
  children: [
    m("h3").text("Final Step (最後一步)"),
    m("ul").append(
      m("li").text("你可不輸入備註, 現在按 Submit 按鈕完成一筆記帳"),
      m("li").text("也可輸入備註, 按 Enter 設置備註後再按 Submit 提交表單"),
      m("li").append(
        span("設置常用備註的方法詳見 "),
        createLinkElem("https://github.com/ahui2016/HuuTuu", {
          text: "github.com/ahui2016/HuuTuu",
          blank: true,
        })
      )
    ),
    m(Form_Notes).addClass("my-3"),
    m(NotesList).addClass("my-3"),
  ],
});
