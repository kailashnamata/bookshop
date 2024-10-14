sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SuggestionItem",
	"sap/ui/model/json/JSONModel",
],
function (Controller, Filter, FilterOperator, SuggestionItem, JSONModel) {
    "use strict";

    return Controller.extend("bookshop.controller.Homepage", {
        onInit: function () {
			this.getView().byId("searchField").setEnableSuggestions(false);
        },
		onAfterRendering: function(){
			var aFilters = [];
			var filter = new Filter("type", FilterOperator.Contains, "New Arrival");
			aFilters.push(filter);

			// update list binding
			var oList = this.byId("gridList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

        onTabSelection: function(oEvent) {
			var tabText = oEvent.getSource().oSelectedItem.mProperties.text;
            this.getView().byId("tabTitle").setText(oEvent.getSource().oSelectedItem.mProperties.text);
			// add filter for search
			var aFilters = [];
			if (tabText && tabText.length > 0) {
				var filter = new Filter("type", FilterOperator.Contains, tabText);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("gridList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
			this.getView().getModel().setProperty("/tabBooksData", aFilters);
        },

        onSearch: function (oEvent) {
			this.getView().byId("searchField").setEnableSuggestions(true);
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
		},

		onSuggest: function (event) {
			
			this.oSF = this.getView().byId("searchField");
			var sValue = event.getParameter("suggestValue"),
				aFilters = [];
			if (sValue) {
				aFilters = [
					new Filter([
						new Filter("title", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						})
					], false)
				];
			}

			this.oSF.getBinding("suggestionItems").filter(aFilters);
			this.oSF.suggest();
			this.getView().byId("searchField").setEnableSuggestions(false);
		}
    });
});
