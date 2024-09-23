sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("bookshop.controller.Homepage", {
        onInit: function () {

        },

        onTabSelection: function(oEvent) {
            this.getView().byId("tabTitle").setText(oEvent.getSource().oSelectedItem.mProperties.text);
        },

        onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("title", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("gridList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		}
    });
});
