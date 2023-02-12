const NaviBar = cc("div", {
  children: [
    createLinkElem("index.html", { text: "HuuTuu" }),
    span(" .. "),
    span("Create Label (新建標籤)"),
  ],
});

const NameInput = createInput();
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
    m(SubmitBtn),
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
