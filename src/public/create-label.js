const FormAlert_CreateLabel = createAlert();
const LabelNameInput = createInput("text", "required");
const CreateLabelBtn = createButton('Create', 'primary');

const Form_CreateLabel = cc("form", {
  attr: { autocomplete: "off" },
  children: [
    m("div")
      .addClass("input-group input-group-lg")
      .append(
        // label
        m("span")
          .addClass('input-group-text')
          .text("Label Name"),

        // text input
        m(LabelNameInput)
          .addClass("form-control")
          .attr({ placeholder: "標籤名" }),

        // hidden button
        hiddenButtonElem(),

        // submit button
        m(CreateLabelBtn).on("click", (event) => {
          event.preventDefault();
          const name = valOf(LabelNameInput, "trim");
          if (!name) {
            FormAlert_CreateLabel.insert("warning", "必須填寫標籤名");
            focus(LabelNameInput);
            return;
          }
          axiosPost(
            "/api/create-label",
            { name: name },
            FormAlert_CreateLabel,
            (resp) => {
              const label = resp.data;
              FormAlert_CreateLabel.insert(
                "success",
                `成功創建 Label {id: ${label.id}, name: ${label.name}}`
              );
              LabelNameInput.elem().val("");
              focus(LabelNameInput);
            }
          );
        })
      ),
  ],
});

const formWithAlert_CreateLabel = m("div").append(
  m(Form_CreateLabel),
  m(FormAlert_CreateLabel).addClass("row my-1")
);
