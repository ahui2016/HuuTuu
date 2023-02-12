// 这些 class 只是为了方便生成文档，不实际使用。
class LinkOptions {}
class AxiosError {}

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
 * @param {number?} timeout default=300
 */
function focus(obj, timeout = 300) {
  if ("elem" in obj) obj = obj.elem();
  setTimeout(() => {
    obj.trigger("focus");
  }, timeout);
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
 * @returns {mjComponent}
 */
function createInput(type = "text", id = null) {
  return cc("input", { id: id, classes: "form-control", attr: { type: type } });
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
