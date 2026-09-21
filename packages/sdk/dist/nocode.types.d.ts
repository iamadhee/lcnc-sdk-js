
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
declare class kf { 
	static context: Form 
	static client: Client 
	static formatter: Formatter 
	static user: userObject 
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
