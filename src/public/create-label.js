// const NaviBar = cc("div", {
//   children: [
//     createLinkElem("index.html", { text: "HuuTuu" }),
//     span(" .. "),
//     span("Create Label (新建標籤)"),
//   ],
// });

const CreateLabelFormAlert = createAlert();
const LabelNameInput = createInput("text", "required");
const CreateLabelBtn = cc("button", { text: "Create", classes: "btn btn-primary" });

const CreateLabelForm = cc("form", {
  attr: { autocomplete: "off" },
  children: [
    createFormControl(LabelNameInput, "Label Name", "標籤名"),
    m('button')
      .text('submit')
      .hide()
      .on("click", (e) => {
        // 这个按钮是隐藏不用的，为了防止按回车键提交表单
        e.preventDefault();
        return false;
      }),
    m(CreateLabelFormAlert).addClass('my-1'),
    m(CreateLabelBtn).on("click", (event) => {
      event.preventDefault();
      const name = valOf(LabelNameInput, 'trim');
      if (!name) {
        CreateLabelFormAlert.insert('warning', '必須填寫標籤名');
        focus(LabelNameInput);
        return;
      }
      axiosPost('/api/create-label', {name: name}, CreateLabelFormAlert, resp => {
        const label = resp.data;
        CreateLabelFormAlert.insert('success', `成功創建 Label {id: ${label.id}, name: ${label.name}}`)
        LabelNameInput.elem().val('');
        focus(LabelNameInput);
      });
    }),
  ],
});

// CreateLabelForm.init = () => {
//   focus(LabelNameInput);
// };

// $("#root").append(m(NaviBar).addClass("my-3"), m(CreateLabelForm));
// init();
// function init() {
//   CreateLabelForm.init();
// }
