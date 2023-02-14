/**
 * 获取地址栏的参数。
 * @param {string} name
 * @returns {string | null}
 */
function getUrlParam(name) {
  const queryString = new URLSearchParams(document.location.search);
  return queryString.get(name);
}

/**
 * obj 是 mjComponent 或 mjComponent 的 id.
 * @param {mjComponent | string} obj
 */
function disable(obj) {
  const id = typeof obj == "string" ? obj : obj.id;
  const nodeName = $(id).prop("nodeName");
  if (nodeName == "BUTTON" || nodeName == "INPUT") {
    $(id).prop("disabled", true);
  } else {
    $(id).css("pointer-events", "none");
  }
}

/**
 * obj 是 mjComponent 或 mjComponent 的 id.
 * @param {mjComponent | string} obj
 */
function enable(obj) {
  const id = typeof obj == "string" ? obj : obj.id;
  const nodeName = $(id).prop("nodeName");
  if (nodeName == "BUTTON" || nodeName == "INPUT") {
    $(id).prop("disabled", false);
  } else {
    $(id).css("pointer-events", "auto");
  }
}

/**
 * 使用 mjElement.append() 时，如果直接 append 字符串可以注入 html,
 * 建议用 span() 来包裹字符串。
 * @param {string} text
 * @returns {mjElement}
 */
function span(text) {
  return m("span").text(text);
}

/**
 * @param {mjComponent} list
 * @param {mjComponent[]} items
 */
function prependToList(list, items) {
  items.forEach((item) => {
    list.elem().prepend(m(item));
    if (item.init) item.init();
  });
}

/**
 * @param {mjComponent} list
 * @param {mjComponent[]} items
 */
function appendToList(list, items) {
  items.forEach((item) => {
    list.elem().append(m(item));
    if (item.init) item.init();
  });
}

/**
 * @param {mjElement | mjComponent} obj
 * @param {"trim"?} trim
 * @returns {string}
 */
function valOf(obj, trim) {
  let s = "elem" in obj ? obj.elem().val() : obj.val();
  return trim == "trim" ? s.trim() : s;
}

/**
 * @param {mjElement | mjComponent} obj
 * @param {number?} timeout default=300
 */
function focus(obj, timeout = 300) {
  if ("elem" in obj) obj = obj.elem();
  setTimeout(() => {
    obj.trigger("focus");
  }, timeout);
}

/**
 * msgType: primary/secondary/success/danger/warning/info/light/dark
 */
function createAlert() {
  const alert = cc("div");

  alert.insertElem = (elem) => {
    alert.elem().prepend(elem);
  };

  /**
   * msgType: primary/secondary/success/danger/warning/info/light/dark
   * @param {string} msgType
   * @param {string} msg
   */
  alert.insert = (msgType, msg) => {
    const time = dayjs().format("HH:mm:ss");
    const timeMsg = `${time} ${msg}`;
    if (msgType == "danger") console.log(timeMsg);

    const dismissBtn = m("button").addClass("btn-close").attr({
      type: "button",
      "data-bs-dismiss": "alert",
      "aria-label": "Close",
    });

    const elem = m("div")
      .addClass(`alert alert-${msgType} alert-dismissible fade show my-1`)
      .attr({ role: "alert" })
      .append(span(timeMsg), dismissBtn);

    alert.insertElem(elem);
  };

  alert.clear = () => {
    alert.elem().html("");
  };

  return alert;
}

/**
 * @param {string} href
 * @param {LinkOptions?} options `{text?: string, title?: string, blank?: 'blank'}`
 * @returns {mjElement}
 */
function createLinkElem(href, options) {
  if (!options) {
    return m("a").text(href).attr("href", href);
  }
  if (!options.text) options.text = href;
  const link = m("a").text(options.text).attr("href", href);
  if (options.title) link.attr("title", options.title);
  if (options.blank == "blank") link.attr("target", "_blank");
  return link;
}

/**
 * @param {string} type default = "text"
 * @param {'required'?} required
 * @param {string?} id
 * @returns {mjComponent}
 */
function createInput(type = "text", required = null, id = null) {
  return cc("input", {
    id: id,
    classes: "form-control",
    attr: { type: type },
    prop: { required: required == "required" ? true : false },
  });
}

/**
 * @param {number} rows default = 3
 * @returns {mjComponent}
 */
function createTextarea(rows = 3, id = null) {
  return cc("textarea", {
    id: id,
    classes: "form-control",
    attr: { rows: rows },
  });
}

/**
 * 主要用来给 input 或 textarea 包裹一层。
 * @param {mjComponent} comp 用 createInput 或 createTextarea 函数生成的组件。
 * @param {string} labelText
 * @param {string | mjElement | null} description
 * @param {string} classes default = "mb-3"
 * @returns {mjElement}
 */
function createFormControl(comp, labelText, description, classes = "mb-3") {
  const formControl = m("div")
    .addClass(classes)
    .append(
      m("label")
        .addClass("form-label")
        .attr({ for: comp.raw_id })
        .text(labelText),
      m(comp)
    );

  if (!description) return formControl;

  let descElem = description;

  if (typeof description == "string") {
    descElem = m("div").addClass("form-text").text(description);
  }
  formControl.append(descElem);
  return formControl;
}

/**
 * 如果 id 以数字开头，就需要使用 elemID 给它改成以字母开头，
 * 因为 DOM 的 ID 不允许以数字开头。
 * @param {string} id
 * @param {string} prefix
 * @returns {string}
 */
function elemID(id, prefix = 'e') {
  return `${prefix}${id}`;
}

/**
 * @param {string} text
 * @param {mjComponent?} alert
 */
function copyToClipboard(text, alert) {
  navigator.clipboard.writeText(text).then(
    () => {
      if (alert) alert.insert("success", "複製成功");
    },
    () => {
      if (alert) alert.insert("danger", "複製失敗");
    }
  );
}

/**
 * https://axios-http.com/docs/handling_errors
 * @param {AxiosError} err
 * @returns {string}
 */
function axiosErrToStr(err) {
  if (err.response) {
    // err.response.data.detail 裏的 detail 與後端對應.
    return `[${err.response.status}] ${err.response.data.detail}`;
  }
  if (err.request) {
    return (
      err.request.status + ":The request was made but no response was received."
    );
  }
  return err.message;
}

/**
 * axios get with default error handler.
 */
function axiosGet(url, alert, onSuccess, onAlways) {
  axios
    .get(url)
    .then(onSuccess)
    .catch((err) => {
      alert.insert("danger", axiosErrToStr(err));
    })
    .then(() => {
      if (onAlways) onAlways();
    });
}

/**
 * axios post with default error handler.
 */
function axiosPost(url, body, alert, onSuccess, onAlways) {
  axios
    .post(url, body)
    .then(onSuccess)
    .catch((err) => {
      alert.insert("danger", axiosErrToStr(err));
    })
    .then(() => {
      if (onAlways) onAlways();
    });
}
