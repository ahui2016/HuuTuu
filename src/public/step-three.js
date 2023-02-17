const predefinedNotes = ["你可以自定義常用備註", "定義備註方便重複使用"];

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
        m(SetNotesBtn).on("click", (event) => {
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
    m("p").text("請輸入備註").addClass("my-3"),
    m(Form_Notes).addClass("my-3"),
    m(NotesList).addClass("my-3"),
  ],
});
