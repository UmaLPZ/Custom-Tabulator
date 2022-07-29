/* Custom Tabulator v2.2.1 */

(function (root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "tabulator", "jquery-ui"], factory);
	} else if (typeof module !== "undefined" && module.exports) {
		module.exports = factory(
			require("jquery"),
			require("tabulator"),
			require("jquery-ui")
		);
	} else {
		factory(root.jQuery, root.Tabulator);
	}
})(this, function ($, Tabulator) {
	$.widget("ui.tabulator", {
		_create: function () {
			var options = Object.assign({}, this.options);

			delete options.create;
			delete options.disabled;

			this.table = new Tabulator(this.element[0], options);

			//map tabulator functions to jquery wrapper
			for (var key in Tabulator.prototype) {
				if (
					typeof Tabulator.prototype[key] === "function" &&
					key.charAt(0) !== "_"
				) {
					this[key] = this.table[key].bind(this.table);
				}
			}
		},

		_setOption: function (option, value) {
			console.error(
				"Tabulator jQuery wrapper does not support setting options after the table has been instantiated"
			);
		},

		_destroy: function (option, value) {
			this.table.destroy();
		},
	});
});
