var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _listeners, _textEncoder, _textDecoder, _csrfToken;
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");
const LISTENER_CMDS = {
  API: "API",
  GET_CONTEXT: "GET_CONTEXT",
  RETURN: "RETURN",
  GET_FORM_FIELD: "GET_FORM_FIELD",
  UPDATE_FORM: "UPDATE_FORM",
  GET_FORM_VALIDATION_ERRORS: "GET_FORM_VALIDATION_ERRORS",
  GET_FORM_CONFIGURATION: "GET_FORM_CONFIGURATION",
  GET_FORM_FIELD_STATE: "GET_FORM_FIELD_STATE",
  GET_TABLE: "GET_TABLE",
  GET_TABLE_ROW: "GET_TABLE_ROW",
  ADD_TABLE_ROW: "ADD_TABLE_ROW",
  ADD_TABLE_ROWS: "ADD_TABLE_ROWS",
  DELETE_TABLE_ROW: "DELETE_TABLE_ROW",
  TO_JSON: "TO_JSON",
  GET_TABLE_ROWS: "GET_TABLE_ROWS",
  GET_SELECTED_TABLE_ROWS: "GET_SELECTED_TABLE_ROWS",
  MESSAGE: "MESSAGE",
  CONFIRM: "CONFIRM",
  ALERT: "ALERT",
  REDIRECT: "REDIRECT",
  OPEN_PAGE: "OPEN_PAGE",
  GET_IMAGE_URL: "GET_IMAGE_URL",
  FILEPICKER_OPEN: "FILEPICKER_OPEN",
  FILEPREVIEW_OPEN: "FILEPREVIEW_OPEN",
  FILE_UPLOAD: "FILE_UPLOAD",
  SCANNER_OPEN: "SCANNER_OPEN",
  GEOLOCATION_OPEN: "GEOLOCATION_OPEN",
  GET_ROLES: "GET_ROLES",
  SWITCH_ROLE: "SWITCH_ROLE",
  FORMAT_DATE: "FORMAT_DATE",
  FORMAT_DATE_TIME: "FORMAT_DATE_TIME",
  FORMAT_NUMBER: "FORMAT_NUMBER",
  FORMAT_CURRENCY: "FORMAT_CURRENCY",
  FORMAT_BOOLEAN: "FORMAT_BOOLEAN",
  GET_APP_VARIABLE: "GET_APP_VARIABLE",
  SET_APP_VARIABLE: "SET_APP_VARIABLE",
  GET_PAGE_VARIABLE: "GET_PAGE_VARIABLE",
  SET_PAGE_VARIABLE: "SET_PAGE_VARIABLE",
  GET_PAGE_PARAMS: "GET_PAGE_PARAMS",
  GET_ALL_PAGE_PARAMS: "GET_ALL_PAGE_PARAMS",
  PAGE_ON_CLOSE: "PAGE_ON_CLOSE",
  OPEN_POPUP: "OPEN_POPUP",
  GET_POPUP_PARAMS: "GET_POPUP_PARAMS",
  GET_ALL_POPUP_PARAMS: "GET_ALL_POPUP_PARAMS",
  CLOSE_POPUP: "CLOSE_POPUP",
  COMPONENT_GET: "COMPONENT_GET",
  COMPONENT_REFRESH: "COMPONENT_REFRESH",
  COMPONENT_SHOW: "COMPONENT_SHOW",
  COMPONENT_HIDE: "COMPONENT_HIDE",
  COMPONENT_ADD_EVENT_LISTENER: "COMPONENT_ADD_EVENT_LISTENER",
  CC_INITIALIZE: "CC_INITIALIZE",
  CC_WATCH_PARAMS: "CC_WATCH_PARAMS",
  CC_SET_ROUTE: "CC_SET_ROUTE",
  CC_WATCH_ROUTE: "CC_WATCH_ROUTE",
  WINDOW_NDEF_READER_NEW: "WINDOW_NDEF_READER_NEW",
  WINDOW_NDEF_READER_SCAN: "WINDOW_NDEF_READER_SCAN",
  WINDOW_NDEF_READER_WRITE: "WINDOW_NDEF_READER_WRITE",
  WINDOW_NDEF_READER_ADD_EVENT_LISTENER: "WINDOW_NDEF_READER_ADD_EVENT_LISTENER",
  WINDOW_NDEF_READER_MAKE_READONLY: "WINDOW_NDEF_READER_MAKE_READONLY",
  WINDOW_NDEF_READER_ABORT_SCAN: "WINDOW_NDEF_READER_ABORT_SCAN",
  CUSTOM_FUNCTION_RUN: "CUSTOM_FUNCTION_RUN",
  CUSTOM_FUNCTION_GET_RUN: "CUSTOM_FUNCTION_GET_RUN",
  CUSTOM_FUNCTION_ON_RUN_COMPLETE: "CUSTOM_FUNCTION_ON_RUN_COMPLETE",
  CUSTOM_FUNCTION_STOP_WATCH: "CUSTOM_FUNCTION_STOP_WATCH",
  DECISION_TABLE_EXECUTE: "DECISION_TABLE_EXECUTE",
  DATAFORM_IMPORT_CSV: "DATAFORM_IMPORT_CSV",
  DATAFORM_OPEN_FORM: "DATAFORM_OPEN_FORM",
  DATAFORM_GET_FIELDS: "DATAFORM_GET_FIELDS",
  DATAFORM_GET_ITEMS: "DATAFORM_GET_ITEMS",
  DATAFORM_CREATE_ITEM: "DATAFORM_CREATE_ITEM",
  DATAFORM_UPDATE_ITEM: "DATAFORM_UPDATE_ITEM",
  DATAFORM_GET_ITEM: "DATAFORM_GET_ITEM",
  DATAFORM_DELETE_ITEM: "DATAFORM_DELETE_ITEM",
  DATAFORM_DISCARD_ITEM: "DATAFORM_DISCARD_ITEM",
  DATAFORM_SUBMIT_ITEM: "DATAFORM_SUBMIT_ITEM",
  DATAFORM_INIT_FORM: "DATAFORM_INIT_FORM",
  DATAFORM_GET_FIELD_OPTIONS: "DATAFORM_GET_FIELD_OPTIONS",
  PROCESS_OPEN_FORM: "PROCESS_OPEN_FORM",
  PROCESS_GET_FIELDS: "PROCESS_GET_FIELDS",
  PROCESS_GET_MYTASK_FIELDS: "PROCESS_GET_MYTASK_FIELDS",
  PROCESS_GET_PARTICIPATED_FIELDS: "PROCESS_GET_PARTICIPATED_FIELDS",
  PROCESS_GET_MY_ITEMS_FIELDS: "PROCESS_GET_MY_ITEMS_FIELDS",
  PROCESS_GET_MY_ITEMS: "PROCESS_GET_MY_ITEMS",
  PROCESS_GET_MY_TASKS_ITEMS: "PROCESS_GET_MY_TASKS_ITEMS",
  PROCESS_GET_PARTICIPATED_ITEMS: "PROCESS_GET_PARTICIPATED_ITEMS",
  PROCESS_GET_ADMIN_ITEMS: "PROCESS_GET_ADMIN_ITEMS",
  PROCESS_CREATE_ITEM: "PROCESS_CREATE_ITEM",
  PROCESS_UPDATE_ITEM: "PROCESS_UPDATE_ITEM",
  PROCESS_GET_ITEM: "PROCESS_GET_ITEM",
  PROCESS_DELETE_ITEM: "PROCESS_DELETE_ITEM",
  PROCESS_GET_ADMIN_ITEM: "PROCESS_GET_ADMIN_ITEM",
  PROCESS_UPDATE_ADMIN_ITEM: "PROCESS_UPDATE_ADMIN_ITEM",
  PROCESS_SUBMIT_ITEM: "PROCESS_SUBMIT_ITEM",
  PROCESS_REJECT_ITEM: "PROCESS_REJECT_ITEM",
  PROCESS_WITHDRAW_ITEM: "PROCESS_WITHDRAW_ITEM",
  PROCESS_SENDBACK_ITEM: "PROCESS_SENDBACK_ITEM",
  PROCESS_REASSIGN_ITEM: "PROCESS_REASSIGN_ITEM",
  PROCESS_GET_REASSIGNEES: "PROCESS_GET_REASSIGNEES",
  PROCESS_RESTART_ITEM: "PROCESS_RESTART_ITEM",
  PROCESS_DISCARD_ITEM: "PROCESS_DISCARD_ITEM",
  PROCESS_GET_PROGRESS: "PROCESS_GET_PROGRESS",
  PROCESS_INIT_FORM: "PROCESS_INIT_FORM",
  PROCESS_GET_FIELD_OPTIONS: "PROCESS_GET_FIELD_OPTIONS",
  PROCESS_PARSE_ATTACHMENT: "PROCESS_PARSE_ATTACHMENT",
  BOARD_IMPORT_CSV: "BOARD_IMPORT_CSV",
  BOARD_OPEN_FORM: "BOARD_OPEN_FORM",
  BOARD_GET_FIELDS: "BOARD_GET_FIELDS",
  BOARD_GET_ITEMS: "BOARD_GET_ITEMS",
  BOARD_CREATE_ITEM: "BOARD_CREATE_ITEM",
  BOARD_UPDATE_ITEM: "BOARD_UPDATE_ITEM",
  BOARD_GET_ITEM: "BOARD_GET_ITEM",
  BOARD_DELETE_ITEM: "BOARD_DELETE_ITEM",
  BOARD_SUBMIT_ITEM: "BOARD_SUBMIT_ITEM",
  BOARD_DISCARD_ITEM: "BOARD_DISCARD_ITEM",
  BOARD_INIT_FORM: "BOARD_INIT_FORM",
  BOARD_GET_FIELD_OPTIONS: "BOARD_GET_FIELD_OPTIONS"
};
function generateId(prefix = "lcncsdk") {
  return `${prefix}-${nanoid()}`;
}
const globalInstances = {};
function processResponse(req, resp) {
  if (resp && Object.keys(resp).length === 1 && req.command !== LISTENER_CMDS.API) {
    let value = Object.values(resp)[0];
    if (value === "undefined")
      return void 0;
    return value;
  } else {
    return resp;
  }
}
function postMessage(args) {
  if (globalThis.parent && globalThis.parent !== globalThis) {
    globalThis.parent.postMessage(args, "*");
  } else {
    globalThis.postMessage(args);
  }
}
function onMessage(event) {
  if (event.origin !== globalThis.location.origin) {
    const data = event.data;
    if (data == null ? void 0 : data.isEvent) {
      const { target, eventParams, eventName, eventConfig = {} } = data;
      let targetInstance = globalInstances[target];
      targetInstance._dispatchEvent(eventName, eventParams);
      if (eventConfig.once) {
        targetInstance._removeEventListener(eventName);
      }
      return;
    }
    let { _req: req, resp } = data;
    if (req == null ? void 0 : req._id) {
      let targetInstance = globalInstances[req._id];
      targetInstance._dispatchMessageEvents(req, resp);
      Reflect.deleteProperty(globalInstances, req._id);
    }
  }
}
globalThis.addEventListener("message", onMessage);
class EventBase {
  constructor() {
    __privateAdd(this, _listeners, void 0);
    __privateSet(this, _listeners, {});
  }
  _addEventListener(eventName, callBack) {
    var _a;
    __privateGet(this, _listeners)[eventName] = ((_a = __privateGet(this, _listeners)) == null ? void 0 : _a[eventName]) || [];
    __privateGet(this, _listeners)[eventName].push(callBack);
  }
  _removeEventListener(eventName, callBack) {
    if (callBack) {
      const listeners = __privateGet(this, _listeners)[eventName] || [];
      const index = listeners.indexOf(callBack);
      index > -1 && listeners.splice(index, 1);
      return;
    }
    Reflect.deleteProperty(__privateGet(this, _listeners), eventName);
  }
  _dispatchEvent(eventName, eventParams) {
    if (Array.isArray(__privateGet(this, _listeners)[eventName])) {
      __privateGet(this, _listeners)[eventName].forEach(
        (callBack) => callBack(eventParams)
      );
      return true;
    }
    return false;
  }
  _dispatchMessageEvents(req, resp) {
    let target = req._id;
    if (Array.isArray(__privateGet(this, _listeners)[target])) {
      __privateGet(this, _listeners)[target].forEach((listener) => {
        try {
          let processedResp = processResponse(req, resp);
          listener(processedResp);
        } catch (err) {
          console.error("Message callback error: ", err);
        }
      });
      this._removeEventListener(target);
    }
  }
}
_listeners = new WeakMap();
class BaseSDK extends EventBase {
  _postMessageAsync(command, args, hasCallBack, callBack) {
    return new Promise((resolve, reject) => {
      const _id = generateId(command.toLowerCase());
      postMessage({ _id, command, ...args });
      globalInstances[_id] = this;
      this._addEventListener(_id, async (data) => {
        if ((data == null ? void 0 : data.errorMessage) || (data == null ? void 0 : data.isError)) {
          reject(data);
        } else {
          if (hasCallBack && callBack) {
            data = await callBack(data);
          }
          resolve(data);
        }
      });
    });
  }
  _postMessage(command, args, callBack) {
    const _id = generateId(command.toLowerCase());
    postMessage({ _id, command, ...args });
    if (callBack) {
      this._addEventListener(args.eventName, callBack);
    }
  }
  _postMessageSync(command, args) {
    let intialValue = 0;
    const _id = generateId(command.toLowerCase());
    let data = { _id, command, ...args };
    let atomics = new AtomicsHandler();
    atomics.reset();
    atomics.store(0, intialValue);
    atomics.encodeData(1, data);
    postMessage(atomics.sab);
    atomics.wait(0, intialValue, 1e4);
    let decodedData = atomics.decodeData();
    let { _req: req, resp } = decodedData;
    let processedResp = processResponse(req, resp);
    if (processedResp == null ? void 0 : processedResp.isError) {
      throw new Error(`Error: ${JSON.stringify(processedResp, null, 2)}`);
    }
    return processedResp;
  }
}
let sharedArrayBufferInstance;
class AtomicsHandler {
  constructor() {
    __privateAdd(this, _textEncoder, void 0);
    __privateAdd(this, _textDecoder, void 0);
    __privateSet(this, _textEncoder, new TextEncoder());
    __privateSet(this, _textDecoder, new TextDecoder());
    sharedArrayBufferInstance = sharedArrayBufferInstance || new SharedArrayBuffer(1024 * 1024);
    this.sab = sharedArrayBufferInstance;
    this.int32Array = new Int32Array(this.sab);
  }
  load(index = 0) {
    return Atomics.load(this.int32Array, index);
  }
  store(index = 0, data) {
    return Atomics.store(this.int32Array, index, data);
  }
  reset() {
    return this.int32Array.fill(0);
  }
  notify(index = 0, count = 1) {
    return Atomics.notify(this.int32Array, index, count);
  }
  wait(index, value, timeout) {
    return Atomics.wait(this.int32Array, index, value, timeout);
  }
  encodeData(index = 0, data) {
    const replacer = (key, value) => value === void 0 ? "undefined" : value;
    let string = JSON.stringify(data, replacer);
    let encodedData = __privateGet(this, _textEncoder).encode(string);
    this.int32Array.set(encodedData, index);
    return this.int32Array;
  }
  decodeData() {
    let uInt8Array = new Uint8Array(this.int32Array);
    let string = __privateGet(this, _textDecoder).decode(uInt8Array).replaceAll(/\x00/g, "");
    return JSON.parse(string);
  }
}
_textEncoder = new WeakMap();
_textDecoder = new WeakMap();
class Form extends BaseSDK {
  constructor(storeId, flowId, instanceId, activityInstanceId) {
    super();
    this.type = "Form";
    this.storeId = storeId;
    this.flowId = flowId;
    this.instanceId = instanceId;
    this.activityInstanceId = activityInstanceId;
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      storeId: this.storeId,
      instanceId: this.instanceId
    });
  }
  getField(fieldId) {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      fieldId
    });
  }
  updateField(args) {
    return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      data: args
    });
  }
  getValidationErrors() {
    return this._postMessageAsync(
      LISTENER_CMDS.GET_FORM_VALIDATION_ERRORS,
      {
        storeId: this.storeId,
        instanceId: this.instanceId
      }
    );
  }
  getFormConfiguration() {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_CONFIGURATION, {
      storeId: this.storeId,
      instanceId: this.instanceId
    });
  }
  getFieldState() {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD_STATE, {
      storeId: this.storeId,
      instanceId: this.instanceId
    });
  }
  getTable(tableId) {
    return new Table(
      this.storeId,
      this.flowId,
      this.instanceId,
      tableId,
      this.activityInstanceId
    );
  }
}
class Table extends BaseSDK {
  constructor(storeId, flowId, instanceId, tableId, activityInstanceId) {
    super();
    this.tableId = tableId;
    this.storeId = storeId;
    this.flowId = flowId;
    this.instanceId = instanceId;
    this.activityInstanceId = activityInstanceId;
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId
    });
  }
  getSelectedRows() {
    return this._postMessageAsync(LISTENER_CMDS.GET_SELECTED_TABLE_ROWS, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId
    });
  }
  getRows() {
    return this._postMessageAsync(
      LISTENER_CMDS.GET_TABLE_ROWS,
      {
        storeId: this.storeId,
        instanceId: this.instanceId,
        tableId: this.tableId
      },
      true,
      (data) => {
        return data.map(
          (row) => new TableForm(
            this.storeId,
            this.flowId,
            this.instanceId,
            this.tableId,
            row.id,
            this.activityInstanceId
          )
        );
      }
    );
  }
  getRow(rowId) {
    return new TableForm(
      this.storeId,
      this.flowId,
      this.instanceId,
      this.tableId,
      rowId,
      this.activityInstanceId
    );
  }
  addRow(rowObject) {
    return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowObject
    });
  }
  addRows(rows) {
    return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROWS, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rows
    });
  }
  deleteRow(rowId) {
    return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rows: [rowId]
    });
  }
  deleteRows(rows) {
    return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rows
    });
  }
}
class TableForm extends BaseSDK {
  constructor(storeId, flowId, instanceId, tableId, rowId, activityInstanceId) {
    super();
    this.storeId = storeId;
    this.flowId = flowId;
    this.instanceId = instanceId;
    this.type = "TabelForm";
    this.tableId = tableId;
    this.rowId = rowId;
    this.activityInstanceId = activityInstanceId;
  }
  getParent() {
    return new Form(
      this.storeId,
      this.flowId,
      this.instanceId,
      this.activityInstanceId
    );
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowId: this.rowId
    });
  }
  getField(fieldId) {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowId: this.rowId,
      fieldId
    });
  }
  updateField(args) {
    return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
      storeId: this.storeId,
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowId: this.rowId,
      data: args
    });
  }
}
class Client extends BaseSDK {
  showInfo(message) {
    return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
  }
  showConfirm(args) {
    return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
      data: {
        title: args.title,
        content: args.content,
        okText: args.okText || "Ok",
        cancelText: args.cancelText || "Cancel"
      }
    });
  }
  redirect(url) {
    return super._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
  }
  getImageUrl(imageValue) {
    return this._postMessageAsync(LISTENER_CMDS.GET_IMAGE_URL, {
      imageValue
    });
  }
  openFilePicker(options) {
    return this._postMessageAsync(LISTENER_CMDS.FILEPICKER_OPEN, {
      options
    });
  }
  openScanner(options = {}) {
    return this._postMessageAsync(LISTENER_CMDS.SCANNER_OPEN, {
      options
    });
  }
  pickLocation(value) {
    return this._postMessageAsync(LISTENER_CMDS.GEOLOCATION_OPEN, {
      value
    });
  }
  uploadFile(file, fileName) {
    return this._postMessageAsync(LISTENER_CMDS.FILE_UPLOAD, {
      file,
      fileName: fileName != null ? fileName : file.name
    });
  }
  openFilePreview(args) {
    var _a;
    return this._postMessageAsync(LISTENER_CMDS.FILEPREVIEW_OPEN, {
      files: args.files,
      indexOfFile: (_a = args.indexOfFile) != null ? _a : 0
    });
  }
}
class Formatter extends BaseSDK {
  toDate(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE, {
      date
    });
  }
  toDateTime(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE_TIME, {
      date
    });
  }
  toNumber(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_NUMBER, {
      value
    });
  }
  toCurrency(value, currencyCode) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_CURRENCY, {
      value,
      currencyCode
    });
  }
  toBoolean(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_BOOLEAN, {
      value
    });
  }
}
class NDEFReader extends BaseSDK {
  constructor() {
    super();
    this.id = generateId(LISTENER_CMDS.WINDOW_NDEF_READER_NEW);
    globalInstances[this.id] = this;
    this._postMessage(
      LISTENER_CMDS.WINDOW_NDEF_READER_NEW,
      {
        id: this.id,
        operation: "new"
      },
      (data) => {
      }
    );
  }
  scan() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_SCAN,
        { id: this.id, operation: "scan" },
        ({ data, err }) => {
          console.log("scan data from main window ", data);
          resolve(data);
        }
      );
    });
  }
  write(data) {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_WRITE,
        { id: this.id, operation: "write", data },
        ({ data: data2, err }) => {
        }
      );
    });
  }
  addEventListener(eventName, cb) {
    this._postMessage(
      LISTENER_CMDS.WINDOW_NDEF_READER_ADD_EVENT_LISTENER,
      {
        id: this.id,
        operation: "addEventListener",
        eventName
      },
      () => {
      }
    );
  }
  makeReadOnly() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_MAKE_READONLY,
        { id: this.id, operation: "makeReadOnly" },
        ({ data, err }) => {
        }
      );
    });
  }
  abortScan() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_ABORT_SCAN,
        { id: this.id, operation: "abortScan" },
        ({ data, err }) => {
        }
      );
    });
  }
}
const window = {
  NDEFReader
};
class NocodeSDK extends BaseSDK {
  constructor(props) {
    super();
    __privateAdd(this, _csrfToken, void 0);
    if (props.tableId && props.tableRowId) {
      this.context = new TableForm(
        props.formInstanceId,
        props.flowId,
        props.formInstanceId,
        props.tableId,
        props.tableRowId
      );
    } else if (props.formInstanceId) {
      this.context = new Form(
        props.formInstanceId,
        props.flowId,
        props.formInstanceId
      );
    }
    this.client = new Client();
    this.formatter = new Formatter();
    this.user = props.user;
    this.account = props.account;
    __privateSet(this, _csrfToken, props.csrfToken);
  }
  async api(url, args) {
    const response = await globalThis.fetch(url, {
      ...args,
      headers: {
        ...(args == null ? void 0 : args.headers) || {},
        "X-Csrf-Token": __privateGet(this, _csrfToken)
      }
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return response;
    }
  }
}
_csrfToken = new WeakMap();
function initSDK(config) {
  return new NocodeSDK(config);
}
export { initSDK as default, window };
