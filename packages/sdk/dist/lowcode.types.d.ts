
declare class Form { 
	type: string 
	instanceId: string 
	activityInstanceId: string 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
	getValidationErrors(): any; 
	getFormConfiguration(): any; 
	getFieldState(): any; 
	getTable(tableId: string): Table; 
}
declare class Table { 
	toJSON(): any; 
	getSelectedRows(): any; 
	getRows(): TableForm[]; 
	getRow(rowId: string): TableForm; 
	addRow(rowObject: object): any; 
	addRows(rows: object[]): any; 
	deleteRow(rowId: string): any; 
	deleteRows(rows: string[]): any; 
}
declare class TableForm { 
	type: string 
	getParent(): Form; 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
}
declare class Client { 
	/**
         * Display an info message toast in the platform.
         *
         * @param message - The message to display. Accepts a string or object (serialized to JSON).
         * @returns A promise that resolves when the message is shown.
         *
         * @example
         * await kf.client.showInfo("Record saved successfully");
         */
        showInfo(message: string | object): any; 
	/**
         * Display a confirmation dialog and wait for the user's response.
         *
         * @param args - Dialog configuration.
         * @param args.title - Dialog title.
         * @param args.content - Body text of the dialog.
         * @param args.okText - Label for the confirm button (default: "Ok").
         * @param args.cancelText - Label for the cancel button (default: "Cancel").
         * @returns A promise that resolves with `{ action: "OK" }` or `{ action: "CANCEL" }`.
         *
         * @example
         * const { action } = await kf.client.showConfirm({
         *   title: "Delete record?",
         *   content: "This cannot be undone.",
         *   okText: "Delete",
         *   cancelText: "Cancel",
         * });
         * if (action === "OK") { ... }
         */
        showConfirm(args: {
            title: string;
            content: string;
            okText: string;
            cancelText: string;
        }): any; 
	/**
         * Navigate the platform to the given URL.
         *
         * @param url - The URL to navigate to.
         *
         * @example
         * kf.client.redirect("https://example.com");
         */
        redirect(url: string): any; 
	/**
         * Resolve a Kissflow image field value to a base64 data URL.
         *
         * Custom components (iframes) cannot load Kissflow-hosted images directly due to
         * CORS restrictions and 302 redirects to signed S3 URLs. This method fetches the
         * image in the parent window (which has the required session cookies) and returns
         * a self-contained `data:image/...;base64,...` URL that can be used as `<img src>`
         * without any CORS issues.
         *
         * @param imageValue - The image field value must contain a `key` property and
         * optionally a `photos` array. Uses `photos[1]` (preview resolution) when available,
         * falls back to `key`.
         * @returns A promise that resolves with the base64 data URL string.
         *
         * @example
         * const dataUrl = await kf.client.getImageUrl(imageFieldValue);
         * document.querySelector("#avatar").src = dataUrl;
         */
        getImageUrl(imageValue: Record<string, unknown>): any; 
	/**
         * Open the platform's file picker, upload the selected file(s), and resolve
         * with their metadata.
         *
         * Custom components (iframes) cannot access the platform's authenticated upload
         * endpoints directly. This method opens the file picker in the parent window
         * (which has the required session), runs the full select → upload flow, and
         * resolves once all uploads settle with an array of the uploaded files'
         * metadata (each including `key`, `name`, `size`, `photos`, etc. — the same
         * shape consumed by `getImageUrl`).
         *
         * Always resolves with an array — a single-element array for single-file
         * pickers (e.g. `maxCount: 1` for `Image`), one entry per uploaded file for
         * multi-file pickers (e.g. `Attachment`). Resolves with `[]` if the user closes
         * the picker without completing any upload.
         *
         * @param options - File picker configuration (e.g. `fileExtensions`, `maxSize`,
         * `maxCount`, `imageProps`).
         * @returns A promise that resolves with an array of uploaded file metadata
         * objects (empty if the picker was closed without uploading anything).
         *
         * @example
         * const files = await kf.client.openFilePicker({ fileExtensions: ["JPG", "PNG"] });
         * if (files.length) onChange(files[0]); // single-file consumer (Image)
         *
         * @example
         * const files = await kf.client.openFilePicker({ maxCount: 10 });
         * if (files.length) onChange([...existing, ...files]); // multi-file consumer (Attachment)
         */
        openFilePicker(options: FilePickerOptions): any; 
	/**
         * Open the platform's barcode/QR scanner and resolve with the decoded text.
         *
         * The scanner UI (camera stream + decoding) runs in the parent window, which
         * owns the camera permission — the iframe itself never accesses the camera.
         * Camera-permission prompts and denials are handled inside the scanner UI;
         * they are not surfaced as errors here.
         *
         * Resolves with `null` if the user closes the scanner without a successful
         * scan (including the scanner's own inactivity timeout).
         *
         * Note: currently supported in web custom app UIs; the mobile (PWA) custom
         * UI does not host the scanner portal yet.
         *
         * @param options - Scanner configuration (e.g. `localFileScan` to allow
         * decoding from an uploaded image instead of the camera).
         * @returns A promise that resolves with the decoded string, or `null` if the
         * scanner was closed without scanning.
         *
         * @example
         * const code = await kf.client.openScanner({ localFileScan: true });
         * if (code) onChange(code);
         */
        openScanner(options?: ScannerOptions): any; 
	/**
         * Open the platform's native Geolocation map picker (search, current-location
         * detection, marker drag, reverse-geocoding) in a modal over the custom
         * form/component. Runs in the parent window, which owns the Google Maps API
         * key — the iframe itself never needs one.
         *
         * Resolves with `null` if the user closes the picker without selecting a
         * location.
         *
         * @param value - Optional current geolocation value to pre-select on the map.
         * @returns A promise that resolves with the picked location object, or
         * `null` if the picker was closed without a selection.
         *
         * @example
         * const location = await kf.client.pickLocation();
         * if (location) onChange(location);
         */
        pickLocation(value?: GeolocationValue): any; 
	/**
         * Upload a File object to Kissflow's S3 storage and resolve with its metadata.
         *
         * Use this when you have a File/Blob already in memory (e.g. a canvas drawing
         * converted to a PNG blob) and need to upload it without opening a file picker UI.
         * The platform runs the upload in the parent window (which has the required session)
         * and resolves with the uploaded file's `{ key, name, ... }` metadata — the same
         * shape returned by `openFilePicker`.
         *
         * Resolves with `null` if the upload fails.
         *
         * @param file - The File or Blob to upload.
         * @param fileName - Optional file name override (defaults to `file.name`).
         * @returns A promise that resolves with the uploaded file metadata, or `null` on failure.
         *
         * @example
         * const blob = await new Promise<Blob>(res => canvas.toBlob(res, 'image/png'));
         * const file = new File([blob], 'signature.png', { type: 'image/png' });
         * const result = await kf.client.uploadFile(file);
         * if (result) onChange(result);
         */
        uploadFile(file: UploadableFile, fileName?: string): any; 
	/**
         * Open the platform's file preview (lightbox) for one or more files.
         *
         * `files` always accepts an array — pass a single-element array for fields like
         * `Image`, or the full list for multi-file fields like `Attachment`. The host's
         * preview UI natively renders next/prev navigation across the array; the SDK
         * just passes the file list through, no extra navigation surface is needed here.
         *
         * @param args - Preview configuration.
         * @param args.files - Array of file metadata objects to preview.
         * @param args.indexOfFile - Index of the file to open the preview on (default: 0).
         * @returns A promise that resolves once the user closes the preview.
         *
         * @example
         * await kf.client.openFilePreview({ files: [imageFieldValue] });
         * await kf.client.openFilePreview({ files: attachmentFieldValue, indexOfFile: 2 });
         */
        openFilePreview(args: {
            files: Record<string, unknown>[];
            indexOfFile?: number;
        }): any; 
}
declare class Formatter { 
	toDate(date: string): any; 
	toDateTime(date: string): any; 
	toNumber(value: string): any; 
	toCurrency(value: string, currencyCode: string): any; 
	toBoolean(value: string): any; 
}
declare class Component { 
	_id: string 
	type: string 
	onMount(callback: Function): void; 
	refresh(): any; 
	/** @deprecated Use condition visibility instead. */
        show(): any; 
	/** @deprecated Use condition visibility instead. */
        hide(): any; 
}
declare class Popup { 
	_id: string 
	type: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	close(): any; 
	getComponent(componentId: string): Component; 
}
declare class Page { 
	_id: string 
	popup: Popup 
	type: string 
	_route: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPopup(popupId: string, popupParams?: object): any; 
	getComponent(componentId: string): Component; 
	/**
         * Notify the Kissflow host that the custom UI navigated to `path`,
         * so the parent browser URL mirrors the route. Used by the App UI framework.
         */
        setRoute(path: string): void; 
	/** Returns the initial deep-link route the page was opened with. */
        getRoute(): string; 
}
declare class DecisionTable { 
	evaluate(payload?: object): any; 
}
declare class Dataform { 
	/**
         * Get all items from this dataform with optional filtering, sorting, and pagination
         * @param options - Query options (searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing items and total count
         */
        getItems(options?: DataformQueryOptions): Promise<DataformQueryResponse>; 
	/**
         * Get a single item by ID from this dataform
         * @param options - itemId (required), optional viewId
         * @returns Promise containing the item data
         */
        getItem(options: DataformGetItemOptions): Promise<DataformItem>; 
	/**
         * Create a new item in this dataform
         * @param options - Creation options (data: initial field values, viewId: optional view ID)
         * @returns Promise containing the newly created item with _id
         */
        createItem(options?: DataformCreateItemOptions): Promise<DataformItem>; 
	/**
         * Update an existing item in this dataform
         * @param options - Update options (itemId: required, data: required updated values, viewId: optional view ID)
         * @returns Promise containing the updated item
         */
        updateItem(options: DataformUpdateItemOptions): Promise<DataformItem>; 
	/**
         * Import items from a CSV file into this dataform
         * @param defaultValues - Optional default field values to apply to all imported items
         */
        importCSV(defaultValues?: object): any; 
	/**
         * Open the form UI for an existing dataform item
         * @param item - Dataform item with _id and optional _view_id
         */
        openForm(item: DataformItem): any; 
	/**
         * Delete an item from this dataform
         * @param options - itemId (required), optional viewId
         *
         * @example
         * await dataform.deleteItem({ itemId: "item_123" });
         */
        deleteItem(options: DataformDeleteItemOptions): Promise<void>; 
	/**
         * Discard the current draft for this dataform
         * @param options - optional viewId
         *
         * @example
         * await dataform.discardItem();
         */
        discardItem(options?: DataformDiscardItemOptions): Promise<void>; 
	/**
         * Submit/finalize a dataform item
         * @param options - itemId (required), optional data and viewId
         *
         * @example
         * await dataform.submitItem({ itemId: "item_123" });
         */
        submitItem(options: DataformSubmitItemOptions): Promise<void>; 
	/**
         * Get field definitions for this dataform
         * @param options - Optional viewId to scope fields to a specific view
         */
        getFields(options?: {
            viewId?: string;
        }): Promise<any>; 
	/**
         * Initialize a form with all necessary data (schema, item data, form store)
         * This is the recommended way to create a custom form for dataform records
         * It automatically handles fetching schema, item data, and initializing the form store
         *
         * @param instanceId - Optional instance ID of the dataform record. If omitted, creates a new record
         * @param viewId - Optional view ID to scope the form's schema/permissions to a specific view
         * @returns Promise with Form instance ready to use
         *
         * @example
         * // Load existing record
         * const dataform = kf.app.getDataform("EmpMaster");
         * const form = await dataform.initForm("emp_123");
         * const data = await form.toJSON();
         *
         * // Load existing record scoped to a view
         * const form = await dataform.initForm("emp_123", "EmpMaster_View");
         *
         * // Create new record
         * const form = await dataform.initForm();
         * await form.updateField({ firstName: "John" });
         */
        initForm(instanceId?: string, viewId?: string): Promise<Form>; 
	getFieldOptions(options?: DataformFieldOptions): Promise<DataformQueryResponse>; 
}
declare class Board { 
	/**
         * Import data from CSV file
         * @param defaultValues - Optional default values to apply to imported items
         */
        importCSV(defaultValues?: object): any; 
	/**
         * Open the form UI for a board item
         * @param item - Board item with _id and optional _view_id
         */
        openForm(item: BoardItem): any; 
	/**
         * Get items from a board view
         * @param options - Query options (viewId, searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing items array and total count
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const { items } = await board.getItems({ viewId: "AllItems_View" });
         */
        getItems(options?: BoardGetItemsOptions): Promise<BoardQueryResponse>; 
	/**
         * Get a single board/case item by instance ID
         * @param options - instanceId (required)
         * @returns Promise containing the item data
         */
        getItem(options: BoardGetItemOptions): Promise<BoardItem>; 
	/**
         * Create a new board item
         * @param options - Creation options (data: initial field values)
         * @returns Promise containing the newly created item with _id
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const item = await board.createItem({ data: { Name: "New Item" } });
         */
        createItem(options?: BoardCreateItemOptions): Promise<BoardItem>; 
	/**
         * Update an existing board item
         * @param options - Update options (instanceId, data)
         * @returns Promise containing the updated item
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * await board.updateItem({
         *   instanceId: "item_123",
         *   data: { Name: "Updated Item" }
         * });
         */
        updateItem(options: BoardUpdateItemOptions): Promise<BoardItem>; 
	/**
         * Delete a board item
         * @param options - Delete options (instanceId)
         * @returns Promise resolving on successful deletion
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * await board.deleteItem({ instanceId: "item_123" });
         */
        deleteItem(options: BoardDeleteItemOptions): Promise<void>; 
	/**
         * Submit a board item
         * @param options - instanceId
         */
        submitItem(options: BoardSubmitItemOptions): Promise<void>; 
	/**
         * Discard a board item
         * @param options - instanceId
         */
        discardItem(options: BoardDiscardItemOptions): Promise<void>; 
	/**
         * Get field definitions for this board
         * @param options - Optional viewId to scope fields to a specific view
         */
        getFields(options?: {
            viewId?: string;
        }): Promise<any>; 
	/**
         * Initialize a form for a board item with all necessary setup
         * Fetches schema, item data, creates and initializes the form store
         *
         * @param instanceId - Optional instance ID. If omitted, creates a new board item
         * @param viewId - Optional view ID to scope the form's schema/permissions to a specific view
         * @returns Promise with Form instance ready to use
         *
         * @example
         * // Create new board item
         * const board = kf.app.getBoard("Inventory");
         * const form = await board.initForm();
         * await form.updateField({ Name: "New Item" });
         *
         * // Edit existing board item
         * const form = await board.initForm("item_123");
         * const data = await form.toJSON();
         *
         * // Edit existing board item scoped to a view
         * const form = await board.initForm("item_123", "Inventory_View");
         */
        initForm(instanceId?: string, viewId?: string): Promise<Form>; 
	/**
         * Get field options for dropdown/lookup fields
         * @param options - Field options (instanceId, fieldId)
         * @returns Promise containing the field options
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const options = await board.getFieldOptions({
         *   instanceId: "item_123",
         *   fieldId: "Category"
         * });
         */
        getFieldOptions(options: BoardFieldOptions): Promise<any>; 
}
declare class Process { 
	/**
         * Get my items from this process (items I initiated)
         * @param options - Query options (status, searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing items and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * // Get draft items
         * const { items } = await process.getMyItems({ status: "draft" });
         * // Get in-progress items
         * const { items } = await process.getMyItems({ status: "inprogress" });
         */
        getMyItems(options?: ProcessMyItemsOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get my pending tasks from this process (tasks assigned to me)
         * @param options - Query options (activityId, searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing tasks and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * // Get all pending tasks
         * const { items } = await process.getMyTasksItems();
         * // Get tasks for specific activity/step
         * const { items } = await process.getMyTasksItems({ activityId: "Approval_Step" });
         */
        getMyTasksItems(options?: ProcessMyTasksOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get items I participated in (items where I took action)
         * @param options - Query options (activityId, searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing items and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const { items } = await process.getParticipatedItems();
         */
        getParticipatedItems(options?: ProcessParticipatedOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get all items as admin (requires admin access)
         * @param options - Query options (searchValue, pageNumber, pageSize, payload)
         * @returns Promise containing items and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const { items } = await process.getAdminItems();
         */
        getAdminItems(options?: ProcessAdminOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get a single process instance by ID
         * @param options - instanceId, activityInstanceId (both required)
         * @returns Promise containing the instance data
         */
        getItem(options: ProcessGetItemOptions): Promise<ProcessItem>; 
	/**
         * Create a new process instance (start a new process)
         * @param options - Creation options (data: initial field values)
         * @returns Promise containing the newly created process item with _id and _activity_instance_id
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const item = await process.createItem({ data: { LeaveType: "Annual" } });
         */
        createItem(options?: ProcessCreateItemOptions): Promise<ProcessItem>; 
	/**
         * Update an existing process instance
         * @param options - Update options (instanceId, activityInstanceId, data)
         * @returns Promise containing the updated item
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * await process.updateItem({
         *   instanceId: "item_123",
         *   activityInstanceId: "activity_456",
         *   data: { LeaveType: "Sick" }
         * });
         */
        updateItem(options: ProcessUpdateItemOptions): Promise<ProcessItem>; 
	/**
         * Delete a process instance
         * @param options - Delete options (instanceId)
         * @returns Promise resolving on successful deletion
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * await process.deleteItem({ instanceId: "item_123" });
         */
        deleteItem(options: ProcessDeleteItemOptions): Promise<void>; 
	/**
         * Get a single process instance as admin (requires admin access)
         * @param options - instanceId (required)
         * @returns Promise containing the instance data
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const item = await process.getAdminItem({ instanceId: "item_123" });
         */
        getAdminItem(options: ProcessGetAdminItemOptions): Promise<ProcessItem>; 
	/**
         * Update a process instance as admin (requires admin access)
         * @param options - instanceId, data (required)
         * @returns Promise containing the updated item
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * await process.updateAdminItem({ instanceId: "item_123", data: { LeaveType: "Sick" } });
         */
        updateAdminItem(options: ProcessUpdateAdminItemOptions): Promise<ProcessItem>; 
	/**
         * Open the form UI for a process instance
         * @param item - Process item with _id and _activity_instance_id
         */
        openForm(item: ProcessItem): any; 
	/**
         * Submit a process task
         * @param options - instanceId, activityInstanceId, optional comment
         *
         * @example
         * await process.submitItem({ instanceId: "item_123", activityInstanceId: "act_456" });
         */
        submitItem(options: ProcessSubmitItemOptions): Promise<void>; 
	/**
         * Reject a process task
         * @param options - instanceId, activityInstanceId, comment (required)
         *
         * @example
         * await process.reject({ instanceId: "item_123", activityInstanceId: "act_456", comment: "Not approved" });
         */
        rejectItem(options: ProcessRejectItemOptions): Promise<void>; 
	/**
         * Withdraw a process instance (initiator only)
         * @param options - instanceId, optional comment
         *
         * @example
         * await process.withdraw({ instanceId: "item_123", comment: "Withdrawing request" });
         */
        withdrawItem(options: ProcessWithdrawItemOptions): Promise<void>; 
	/**
         * Send back a process task to a previous step
         * @param options - instanceId, activityInstanceId, stepId (target step), comment (required)
         *
         * @example
         * await process.sendback({ instanceId: "item_123", activityInstanceId: "act_456", stepId: "step_789", comment: "Please revise" });
         */
        sendbackItem(options: ProcessSendbackItemOptions): Promise<void>; 
	/**
         * Reassign a process task to another user
         * @param options - instanceId, activityInstanceId, reassignTo (user object), comment (required), optional reassignType and reassignedFrom
         *
         * @example
         * await process.reassign({ instanceId: "item_123", activityInstanceId: "act_456", reassignTo: { _id: "user_789" }, comment: "Reassigning to manager" });
         */
        reassignItem(options: ProcessReassignItemOptions): Promise<void>; 
	/**
         * Get list of eligible reassignees for a process task
         * @param options - instanceId, activityInstanceId, optional pageNumber, pageSize, query
         */
        getReassignees(options: ProcessGetReassigneesOptions): Promise<any>; 
	/**
         * Restart a rejected/withdrawn process instance
         * @param options - instanceId, activityInstanceId
         *
         * @example
         * await process.restart({ instanceId: "item_123", activityInstanceId: "act_456" });
         */
        restartItem(options: ProcessRestartItemOptions): Promise<void>; 
	/**
         * Discard a draft process instance
         * @param options - instanceId
         *
         * @example
         * await process.discard({ instanceId: "item_123" });
         */
        discardItem(options: ProcessDiscardItemOptions): Promise<void>; 
	/**
         * Get field definitions for this process
         */
        getFields(): Promise<any>; 
	/**
         * Get field definitions for a specific task step (my tasks view)
         * @param options - activityId of the target step
         */
        getMyTaskFields(options: {
            activityId: string;
        }): Promise<any>; 
	/**
         * Get field definitions for a specific task step (participated view)
         * @param options - activityId of the target step
         */
        getParticipatedFields(options: {
            activityId: string;
        }): Promise<any>; 
	/**
         * Get field definitions for the my items view filtered by status
         * @param options - status filter (e.g. "draft", "inprogress", "all")
         */
        getMyItemsFields(options: {
            status: string;
        }): Promise<any>; 
	/**
         * Get the progress/timeline of a process instance
         * @param options - instanceId (required)
         */
        getProgress(options: {
            instanceId: string;
        }): Promise<any>; 
	/**
         * Initialize a form with all necessary data (schema, item data, form store)
         * This is the recommended way to create a custom form for dataform records
         * It automatically handles fetching schema, item data, and initializing the form store
         *
         * @param instanceId - Optional instance ID of the dataform record. If omitted, creates a new record
         * @returns Promise with Form instance ready to use
         *
         * @example
         * // Load existing record
         * const dataform = kf.app.getDataform("EmpMaster");
         * const form = await dataform.initForm("emp_123");
         * const data = await form.toJSON();
         *
         * // Create new record
         * const form = await dataform.initForm();
         * await form.updateField({ firstName: "John" });
         */
        initForm(instanceId?: string, activityInstanceId?: string): Promise<Form>; 
	getFieldOptions(options?: ProcessFieldOptions): Promise<ProcessQueryResponse>; 
	/**
         * Trigger AI document parsing on an uploaded file for a Smart Attachment field.
         * Matches native platform behavior: matching empty fields are auto-filled directly
         * into the form store (respecting field permissions) — no separate apply step needed.
         * Call `form.toJSON()` afterward to read the updated values.
         *
         * @example
         * const form = await process.initForm();
         * const files = await kf.client.openFilePicker({ fileExtensions: ["pdf"], maxCount: 1 });
         * await form.updateField({ [fieldId]: files });
         * await process.parseAttachment({ instanceId: form.instanceId, fieldId, file: files[0] });
         * const updated = await form.toJSON(); // other fields now auto-filled
         */
        parseAttachment(options: ProcessParseAttachmentOptions): Promise<ProcessAttachmentParseResult>; 
}
declare class Application { 
	page: Page 
	_id: string 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPage(pageId: string, pageParams?: object): any; 
	/**
         * Run a published Custom Function by name.
         *
         * An Interactive function resolves with its terminal envelope. A Background
         * function resolves as soon as it is queued, with `Status: "Queued"` and a
         * `RunId`; use {@link getRun} or {@link onRunComplete} for its result.
         *
         * A refused run rejects with the platform's SDK error shape: the message
         * text is in `error` and the code (`KISSFLOW_ERROR_…`) in `errorCode`.
         *
         * Custom Functions are application-scoped: this is reachable from page,
         * component and flow event scripts that run inside an application, where
         * `kf.app` exists. There is no `kf.app` outside one.
         *
         * @example
         * const run = await kf.app.runFunction("review_expense_claim", { claimId });
         */
        runFunction(name: string, parameters?: Record<string, unknown>): Promise<RunEnvelope>; 
	/**
         * Fetch a run's current state, including its `Result` once it has one.
         *
         * @example
         * const run = await kf.app.getRun(runId);
         * if (run.Status === "Success") use(run.Result);
         */
        getRun(runId: string): Promise<RunEnvelope>; 
	/**
         * Be told when a Background run reaches a terminal state.
         *
         * Fires `callBack` once with the run's envelope. If the host cannot watch
         * the run at all, `onError` is called instead of `callBack` ever firing.
         *
         * Returns a function that unsubscribes. The callback lives only as long as
         * the script that registered it: form events end their script after 60 s
         * and a page event ends the previous one when it fires again, while a
         * Background run may take up to 600 s. Prefer polling {@link getRun} from a
         * script that outlives the run, or re-attach after the script restarts.
         *
         * @example
         * const stop = kf.app.onRunComplete(run.RunId, (done) => show(done), (err) => warn(err));
         * // later, e.g. on unmount — the host stops watching the run too
         * stop();
         */
        onRunComplete(runId: string, callBack: (run: RunEnvelope) => void, onError?: (error: RunWatchError) => void): () => void; 
	getDecisionTable(flowId: string): DecisionTable; 
	getDataform(flowId: string): Dataform; 
	getBoard(flowId: string): Board; 
	getProcess(flowId: string): Process; 
	/**
         * List the app's roles and which of them the current user is a member of.
         *
         * Only available in a Development account - use this to build a role
         * picker UI inside the component, then pass the chosen role to
         * {@link switchRole}.
         *
         * @returns A promise that resolves with `{ roles, currentRoles }` - the
         * full list of app roles and the subset the current user belongs to.
         *
         * @example
         * const { roles, currentRoles } = await kf.app.getRoles();
         */
        getRoles(): Promise<{
            roles: rolesObject[];
            currentRoles: rolesObject[];
        }>; 
	/**
         * Switch the current user's active role in a Development account.
         *
         * This performs a real role change - it removes the user from their
         * current role(s) and adds them to the target role. The platform's app
         * shell (top nav, other widgets) picks up the new role on its own; no
         * page reload happens. Only available in a Development account.
         *
         * @param args - Either `roleId` or `roleName` identifying the target role
         * (use the values returned by {@link getRoles}).
         * @returns A promise that resolves with the switched-to role.
         *
         * @example
         * const { roles } = await kf.app.getRoles();
         * await kf.app.switchRole({ roleId: roles[1]._id });
         */
        switchRole(args: {
            roleId?: string;
            roleName?: string;
        }): Promise<rolesObject>; 
}
declare class kf { 
	static context: Component 
	static client: Client 
	static formatter: Formatter 
	static app: Application 
	static user: userObject 
	static env: environmentObject 
	static account: accountObject 
	static eventParameters: any 
	static api(url: string, args?: FetchOptions): Promise<any>; 
}
// ============================================
// Shared Base Types
// ============================================

declare type QueryResponse = {
    items: any[];
    total: number;
    page?: number;
    pageSize?: number;
};

declare type BaseQueryOptions = {
    searchValue?: string;
    pageNumber?: number;
    pageSize?: number;
};

declare type PayloadSortItem = {
    Id: string;
    SortType: "ASC" | "DESC";
};

declare type PayloadOptions = {
    Columns?: any[];
    Filters?: any;
    Sort?: PayloadSortItem[];
    FilterParam?: any;
};

declare type ProcessPayloadOptions = {
    Columns?: any[];
    Filters?: any;
    Sort?: PayloadSortItem[];
};

// ============================================
// Core Types
// ============================================

declare type userObject = {
    _id: string;
    Name: string;
    Email: string;
    /** @deprecated Use AppRoles instead. */
    Role: string;
    AppRoles: rolesObject[];
};

declare type rolesObject = {
    _id: string;
    Name: string;
};

declare type accountObject = {
    _id: string;
};

declare type environmentObject = {
    isMobile: boolean;
};

declare type BoardItem = {
    _id: string;
    _view_id: string;
};

declare type DataformItem = {
    _id: string;
    _view_id?: string;
};

declare type ProcessItem = {
    _id: string;
    _activity_instance_id: string;
};

// ============================================
// Form Field Value Types
// ============================================

// The value shape a Geolocation field is stored/read as across the platform
// (native forms and custom forms alike) — Latitude/Longitude are stringified
// on save, matching the native Geolocation field's saved representation.
declare type GeolocationValue = {
    Address?: string;
    Latitude: string;
    Longitude: string;
    City?: string;
    State?: string;
    Country?: string;
    ZipCode?: string;
    Area?: string;
    PlaceId?: string;
};

// ============================================
// Process Types
// ============================================

declare type ProcessMyItemsOptions = BaseQueryOptions & {
    status?:
        | "draft"
        | "inprogress"
        | "completed"
        | "withdrawn"
        | "rejected"
        | "all";
    payload?: ProcessPayloadOptions;
};

declare type ProcessMyTasksOptions = BaseQueryOptions & {
    activityId?: string;
    payload?: ProcessPayloadOptions;
};

declare type ProcessParticipatedOptions = BaseQueryOptions & {
    activityId?: string;
    payload?: ProcessPayloadOptions;
};

declare type ProcessAdminOptions = BaseQueryOptions & {
    payload?: ProcessPayloadOptions;
};

declare type ProcessQueryResponse = QueryResponse;

declare type ProcessGetItemOptions = {
    instanceId: string;
    activityInstanceId: string;
};

declare type ProcessCreateItemOptions = {
    data?: object;
};

declare type ProcessUpdateItemOptions = {
    instanceId: string;
    activityInstanceId: string;
    data: object;
};

declare type ProcessDeleteItemOptions = {
    instanceId: string;
};

declare type ProcessGetAdminItemOptions = {
    instanceId: string;
};

declare type ProcessUpdateAdminItemOptions = {
    instanceId: string;
    data: object;
};

declare type ProcessSubmitItemOptions = {
    instanceId: string;
    activityInstanceId: string;
    comment?: string;
};

declare type ProcessRejectItemOptions = {
    instanceId: string;
    activityInstanceId: string;
    comment: string;
};

declare type ProcessWithdrawItemOptions = {
    instanceId: string;
    comment?: string;
};

declare type ProcessSendbackItemOptions = {
    instanceId: string;
    activityInstanceId: string;
    stepId: string;
    comment: string;
};

declare type ProcessReassignItemOptions = {
    instanceId: string;
    activityInstanceId: string;
    reassignTo: object;
    comment: string;
    reassignType?: "initiator" | "approver" | "admin";
    reassignedFrom?: object[];
};

declare type ProcessGetReassigneesOptions = {
    instanceId: string;
    activityInstanceId: string;
    pageNumber?: number;
    pageSize?: number;
    query?: string;
};

declare type ProcessRestartItemOptions = {
    instanceId: string;
    activityInstanceId: string;
};

declare type ProcessDiscardItemOptions = {
    instanceId: string;
};

declare type ProcessFieldOptions = {
    instanceId: string;
    activityInstanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

declare type ProcessAttachmentFile = {
    id: string;
    name: string;
    key: string;
    size?: number;
    fileExtension?: string;
};

declare type ProcessParseAttachmentOptions = {
    instanceId: string; // form.instanceId (process record id)
    activityInstanceId: string;
    fieldId: string;
    file: ProcessAttachmentFile;
};

declare type ProcessAttachmentParseResult = {
    appliedFields: string[]; // field IDs auto-filled into the form store
    suggestedBy: string; // name of the parsed file
};

declare type FetchOptions = {
    method?: string;
    body?: string | object;
    headers?: object;
};

// ============================================
// Dataform Types
// ============================================

declare type DataformQueryOptions = BaseQueryOptions & {
    viewId?: string;
    payload?: PayloadOptions;
};

declare type DataformQueryResponse = QueryResponse;

declare type DataformCreateItemOptions = {
    data?: object;
    viewId?: string;
};

declare type DataformUpdateItemOptions = {
    itemId: string; // Required: the _id of the item to update
    data: object; // Required: the updated field values
    viewId?: string; // Optional: view ID for view-specific update
};

declare type DataformGetItemOptions = {
    itemId: string;
    viewId?: string;
};

declare type DataformDeleteItemOptions = {
    itemId: string;
    viewId?: string;
};

declare type DataformDiscardItemOptions = {
    viewId?: string;
};

declare type DataformSubmitItemOptions = {
    itemId: string;
    data?: object;
    viewId?: string;
};

declare type DataformFieldOptions = {
    instanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

// ============================================
// Board Types
// ============================================

declare type BoardGetItemsOptions = BaseQueryOptions & {
    viewId?: string;
    payload?: PayloadOptions;
};

declare type BoardQueryResponse = QueryResponse;

declare type BoardGetItemOptions = {
    instanceId: string;
};

declare type BoardCreateItemOptions = {
    data?: object;
};

declare type BoardUpdateItemOptions = {
    instanceId: string; // Required: the _id of the item to update
    data: object; // Required: the updated field values
};

declare type BoardDeleteItemOptions = {
    instanceId: string; // Required: the _id of the item to delete
};

declare type BoardSubmitItemOptions = {
    instanceId: string;
    comment?: string;
};

declare type BoardDiscardItemOptions = {
    instanceId: string;
};

declare type BoardFieldOptions = {
    instanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

/** The terminal states a Custom Function run ends in, plus the two it passes through. */
declare type RunStatus = "Queued" | "Running" | "Success" | "Failed" | "TimedOut";

/**
 * What a Custom Function run looks like from the SDK.
 *
 * An Interactive function resolves with the terminal envelope directly. A
 * Background function resolves with `Queued` and only `RunId`; fetch the rest
 * with `getRun`, or wait for it with `onRunComplete`.
 */
declare type RunEnvelope = {
	RunId: string;
	Status: RunStatus;
	/** Whatever the function returned. Only constrained when its output contract names properties. */
	Result?: unknown;
	Error?: { Code?: string; Message: string };
};

/**
 * What `onRunComplete`'s error callback receives when the host could not watch the run.
 * `error` carries the text; `errorCode` is the platform code when the failure was an API answer.
 */
declare type RunWatchError = { isError: true; error?: string; errorCode?: string };
