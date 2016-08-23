;(function( $, _) {
	var PostCodesAnywhere = {};

	_.extend(PostCodesAnywhere, {
		el: {},
		post_code_req_url: 'http://services.postcodeanywhere.co.uk/CapturePlus/Interactive/Find/v2.10/json3.ws?callback=?',
		address_req_url: 'http://services.postcodeanywhere.co.uk/CapturePlus/Interactive/Retrieve/v2.10/json3.ws?callback=?',
		response_item_id: null,
		api_key: null,
		SearchTerm: '',
		SearchFor: 'PostalCodes',
		Country: 'GBR',
		LanguagePreference: 'EN',
		input: $(document.createElement("input")),
		input_class: '',
		input_label: '',
		button: $(document.createElement("a")),
		button_class: '',
		button_label: '',
		dropdown: $(document.createElement("select")),
		dropdown_class: '',
		dropdown_items: [],
		error: '',
		error_container: $(document.createElement("div")),
		address_resp: {
			Id: '',
			DomesticId: '',
			Language: '',
			LanguageAlternatives: '',
			Department: '',
			Company: '',
			SubBuilding: '',
			BuildingNumber: '',
			BuildingName: '',
			SecondaryStreet: '',
			Street: '',
			Block: '',
			Neighbourhood: '',
			District: '',
			City: '',
			Line1: '',
			Line2: '',
			Line3: '',
			Line4: '',
			Line5: '',
			AdminAreaName: '',
			AdminAreaCode: '',
			Province: '',
			ProvinceName: '',
			ProvinceCode: '',
			PostalCode: '',
			CountryName: '',
			CountryIso2: '',
			CountryIso3: '',
			CountryIsoNumber: '',
			SortingNumber1: '',
			SortingNumber2: '',
			Barcode: '',
			POBoxNumber: '',
			Label: '',
			Type: '',
			DataLevel : '',
			output_fields: null
		},
		init: function(el, options){
			this.el = el;
			_.extend(this, options);

			if(!this.checkOption()) {
				return;
			}
			this.initElemsListeners();
			this.initSearchElems();

			return this.el;
		},
		checkOption: function(){
			if(!this.el instanceof jQuery){
				console.error('PostCodesAnywhere:error: this is not a jquery object');
				return false;
			}
			if(!this.el.length){
				console.error("PostCodesAnywhere:error: can't find '" + this.el.selector + "' element in DOM");
				return false;
			}

			return true;
		},
		initSearchElems: function(){

			this.input.attr({
				type  : 'text',
				name  : 'post_code_finder',
				class : this.input_class,
				value : '',
				placeholder : this.input_label
			});

			this.button.attr({
				href: 'javascript:void(0);',
				class: 'idpc_button ' + this.button_class
			}).html(this.button_label);

			this.dropdown.attr({
				style: 'display:none',
				class: 'idpc_dropdown ' + this.dropdown_class
			});

			this.error_container.attr({
				style: 'display:none',
				class: 'idpc_error_message'
			});
			
			this.el.append(this.input)
				.append(this.button)
				.append(this.dropdown)
				.append(this.error_container);

			return this;
		},
		initElemsListeners: function(){

			this.input.on('input' , _.bind(this.setPostCode, this) );
			this.input.on('change' , _.bind(this.setPostCode, this) );
			this.button.on('click',  _.bind(this.makeRequestWithPostcode, this) );
			this.dropdown.on('change', _.bind(this.makeRequestByPostcodeId, this) );

			return this;
		},
		setPostCode: function(){
			this.hideErrors();
			this.SearchTerm = this.input.val().toLowerCase();
			return this;
		},
		makeRequestWithPostcode: function(){


			if(!this.SearchTerm.length){
				return;
			}

			var data = {
				Key: this.api_key,
				SearchTerm: this.SearchTerm,
				SearchFor: this.SearchFor,
				Country: this.Country,
				LanguagePreference: this.LanguagePreference
			};

			$.getJSON( this.post_code_req_url, data,  _.bind(this.postcodeResponseProcessor, this) );

		},
		postcodeResponseProcessor: function(data){

			if( this.checkPostCodeRespData(data.Items) ) {
				return this.displayError();
			}

			this.initSelect(data.Items);

		},

		initSelect: function(items){
			this.dropdown_items = items;
			var options = this.createOption();
			this.dropdown.append(options).show();
		},

		createOption: function(){
			var options = '';
			_.each(this.dropdown_items, function(val){
				options += '<option value="'+val.Id+'">'+val.Text+'</option>'
			});
			return  options;
		},

		checkPostCodeRespData: function(items){

			if(!items.length){
				this.setError("We can't find addresses by this post code!");
				return true;
			}

			if(items.length && items[0].Error){
				this.setError(items[0].Resolution);
				return true;
			}

			return false;
		},

		makeRequestByPostcodeId: function(){
			if(!this.dropdown.val()) return;

			var data = {
				Key: this.api_key,
				Id: this.dropdown.val()
			};

			$.getJSON( this.address_req_url, data,  _.bind(this.addressResponseProcessor, this) );

		},

		addressResponseProcessor: function(data){

			if( this.checkAddressRespData(data.Items) ) {
				this.displayError();
			}

			this.address_resp = $.extend(true, this.address_resp , data.Items.pop());
			this.setDataToOutput();

			this.onGetAddress.call(this, this.address_resp);
		},

		setDataToOutput: function(){
			if(!this.output_fields instanceof Object) return;

			_.each(this.output_fields, _.bind( function(val, key){
				var el = $(val);
				if(el.length){
					el.val(this.address_resp[key]);
				}
			}, this));

			return this;
		},

		onGetAddress: $.extend({
			callback: function() {}
		}, arguments[0] || {}),

		checkAddressRespData: function(items){

			if(!items.length){
				this.setError("We can't find address details!");
				return true;
			}
			return false
		},

		setError: function(error){
			this.error = error;
			return this;
		},
		clearError: function(){
			this.error = '';
			return this;
		},
		displayError: function(){
			this.error_container
				.html(this.error)
				.show();

			return this;
		},
		hideErrors: function(){

			this.error_container
				.html('')
				.hide();

			return this.clearError();
		}
	});

	$.fn.postcodes = function(options) {
		return PostCodesAnywhere.init(this, options);
	};

}( jQuery, _ ));


