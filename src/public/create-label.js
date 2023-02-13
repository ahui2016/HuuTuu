const NaviBar = cc("div", {
  children: [
    createLinkElem("index.html", { text: "HuuTuu" }),
    span(" .. "),
    span("Create Label (新建標籤)"),
  ],
});

const FormAlert = createAlert();
const NameInput = createInput("text", "required");
const SubmitBtn = cc("button", { text: "Create", classes: "btn btn-primary" });

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc("button", { id: "submit", text: "submit" });

const Form = cc("form", {
  attr: { autocomplete: "off" },
  children: [
    createFormControl(NameInput, "Name", "標籤名"),
    m(HiddenBtn)
      .hide()
      .on("click", (e) => {
        e.preventDefault();
        return false;
      }),
    m(FormAlert).addClass('my-1'),
    m(SubmitBtn).on("click", (event) => {
      event.preventDefault();
      const name = valOf(NameInput, 'trim');
      if (!name) {
        FormAlert.insert('warning', '必須填寫標籤名');
        focus(NameInput);
        return;
      }
      axiosPost('/api/create-label', {name: name}, FormAlert, resp => {
        const label = resp.data;
        FormAlert.insert('success', `成功創建 Label {id: ${label.id}, name: ${label.name}}`)
        NameInput.elem().val('');
        focus(NameInput);
      });
    }),
  ],
});

Form.init = () => {
  focus(NameInput);
};

$("#root").append(m(NaviBar).addClass("my-3"), m(Form));

init();

function init() {
  Form.init();
}
