# Postcode Anywhere jQuery Library v1.0.0
Simple jQuery library for finding addresses by postcode that use "Postcode Anywhere" service.


Postcode Anywhere service [url](http://www.pcapredict.com/Support/WebService/CapturePlus/Interactive/Find/2.1/)


Required libs:
  - jquery-1.11.2 [link](https://jquery.com/)
  - Underscore.js 1.8.3 [link](http://underscorejs.org)  

```
<script type="text/javascript" src="jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="underscore-min.js"></script>
```

Usage:

HTML:
```
...
<div class='search-postcode'></div>
...

```
JS:

```
$('.search-postcode').postcodes({
				api_key: 'YOUR API KEY',
				input_class: 'base-input',
				input_label: 'Postcode',
				button_class: 'btn',
				button_label: 'Find Address',
				dropdown_class: 'base-select bordered',
				onGetAddress: function(address){
			   //do something
				},
				output_fields: {
					Line1       : '.js-address1',
					Line2       : '.js-address2',
					Line3       : '.js-address3',
					City        : '.js-city',
					PostalCode  : '.js-postcode'
				}
			});
```
