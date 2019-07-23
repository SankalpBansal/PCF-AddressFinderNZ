import { IInputs, IOutputs } from "./generated/ManifestTypes";


export class AddressFinderControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;

	private inputElement: HTMLInputElement;

	private _address_line_1: string;

	private _container: HTMLDivElement;

	private _address_line_2: string;

	private _suburb: string;

	private _city: string;

	private _postcode: string;

	private widget: any;

	private AddressFinder: any;


	/**
	 * Empty constructor.
	 */
	constructor() {
		this.AddressFinder = require('./Widget');
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._container = container;
		this._address_line_1 = this._context.parameters.address_line_1.raw;
		this.inputElement = document.createElement("input");
		this.inputElement.setAttribute("id", "search_field");
		this.inputElement.setAttribute("type", "text");
		this.inputElement.value=this._address_line_1;
		this._container.appendChild(this.inputElement);
		container = this._container;
		//this.mountWidget();
		// Add control initialization code
		//this.GetAddressFinderKeyandContinue();
		this.GetAddressFinderKeyandContinueCallBack(this._context.parameters.afKey.raw);
		
	}

	private createHtmlInputElement(id: string, type: string, display: string) {
		let inputElement = document.createElement("input");
		inputElement.setAttribute("id", id);
		inputElement.setAttribute("type", type);
		inputElement.setAttribute("display", display);
		return inputElement;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;
		this.inputElement.value = this._address_line_1;
		// Add code to update control view

		
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			address_line_1: this._address_line_1,
			address_line_2: this._address_line_2,
			suburb:this._suburb,
			city:this._city,
			postcode:this._postcode
		}
	}

	/*
	 *Retrive addressfinderkey and load control
	*/

	// public GetAddressFinderKeyandContinue() {
	// 	var thisref = this;
	// 	this._context.webAPI.retrieveMultipleRecords("msdyn_configuration", "?$select=msdyn_value&$filter=msdyn_name eq 'AddressFinderKey'&$top=1").then(
	// 		function (data: ComponentFramework.WebApi.RetrieveMultipleResponse) {
	// 			if (data != null && data.entities != null && data.entities.length > 0) {
	// 				let key: string = data.entities[0].msdyn_value;
	// 				thisref.GetAddressFinderKeyandContinueCallBack(key);
	// 			}
	// 		},
	// 		function (errorResponse: any) {
	// 			alert("An error occurred while retrieving records.  Please contact your System Administrator.");
	// 		}
	// 	);
	// }

	loadWidget = (addressFinderKey: string) => {
		var searchField = document.getElementById('search_field');
		this.widget = new this.AddressFinder.Widget(
			searchField,
			addressFinderKey,
			'NZ'
		);
		this.widget.on('result:select', (fullAddress: any, metaData: any) => {

			const selected = new this.AddressFinder.NZSelectedAddress(fullAddress, metaData);
			this._address_line_1 = selected.address_line_1()
			this._address_line_2 = selected.address_line_2()
			this._suburb = selected.suburb()
			this._city = selected.city()
			this._postcode = selected.postcode()
			this._notifyOutputChanged();
		});
	}


	public GetAddressFinderKeyandContinueCallBack(addressFinderKey: string) {

		this.loadWidget(addressFinderKey);
	}


	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}