const LabelList = cc("div", { classes: "d-flex flex-wrap gap-3" });

/**
 * @param {Label} label
 * @returns {mjComponent}
 */
function LabelItem(label) {
  const self = cc("button", {
    id: elemID(label.id, "label"),
    text: label.name,
    attr: { type: "button" },
    classes: "btn rounded-pill btn-success",
  });

  self.init = () => {
    self.elem().on("click", (event) => {
      event.preventDefault();
      const cardTitle = RecordArea.find(".card-title");
      cardTitle.text(label.name);
      window["my-record"].label_id = label.id;
      AppAlert.clear();
      StepOne.elem().fadeOut({
        complete: () => {
          StepTwo.show();
          RecordArea.show();
        },
      });
    });
  };

  return self;
}

const FormAlert_CreateLabel = createAlert();
const LabelNameInput = createInput("text", "required");
const CreateLabelBtn = createButton("Create", "primary");

const Form_CreateLabel = cc("form", {
  attr: { autocomplete: "off" },
  children: [
    m("div")
      .addClass("input-group input-group-lg")
      .append(
        // label
        m("span").addClass("input-group-text").text("New Label"),

        // text input
        m(LabelNameInput)
          .addClass("form-control")
          .attr({ placeholder: "新標籤" }),

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
          if (hasWhiteSpace(name)) {
            FormAlert_CreateLabel.insert("danger", "標籤不可包含空格");
            focus(LabelNameInput);
            return;
          }
          axiosPost({
            url: "/api/create-label",
            body: { name: name },
            alert: FormAlert_CreateLabel,
            onSuccess: (resp) => {
              const label = resp.data;
              FormAlert_CreateLabel.insert(
                "success",
                `成功創建 Label {id: ${label.id}, name: ${label.name}}`
              );
              const Item = LabelItem(label);
              LabelList.elem().prepend(m(Item));
              Item.init();
              LabelNameInput.elem().val("");
              focus(LabelNameInput);
            },
          });
        })
      ),
  ],
});

const FormArea_CreateLabel = cc("div", {
  children: [
    m(Form_CreateLabel),
    m(FormAlert_CreateLabel).addClass("row my-1"),
  ],
});

const ToggleCreateLabelBtn = createButton("新建標籤", "link");

const StepOne = cc("div", {
  children: [
    m("h3").text("Step One (第一步)"),
    m("p")
      .addClass("my-3")
      .append(
        span("請點撃標籤, 或"),
        m(ToggleCreateLabelBtn).on("click", (event) => {
          event.preventDefault();
          FormArea_CreateLabel.show();
          focus(LabelNameInput);
        }),
        span('後點擊標籤.')
      ),
    m(FormArea_CreateLabel).addClass("my-3").hide(),
    m(LabelList).addClass("my-3"),
  ],
});
