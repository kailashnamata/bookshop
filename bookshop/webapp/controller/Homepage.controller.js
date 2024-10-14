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
			onAfterRendering: function () {
				var aFilters = [];
				var filter = new Filter("type", FilterOperator.Contains, "New Arrival");
				aFilters.push(filter);
				this.getView().getModel().setProperty("/selectedTab", "New Arrival");
				this.onRatingStyle(aFilters);

				// update list binding
				var oList = this.byId("gridList");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilters, "Application");
				this.getView().getModel().setProperty("/tabBooksData", aFilters);
			},

			onTabSelection: function (oEvent) {
				var tabText = oEvent.getSource().oSelectedItem.mProperties.text;
				this.getView().byId("tabTitle").setText(oEvent.getSource().oSelectedItem.mProperties.text);
				this.getView().getModel().setProperty("/selectedTab", oEvent.getSource().oSelectedItem.mProperties.text);
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

				// Retrieve the current filtered data based on the selected tab
				var aFilteredData = this.getView().getModel().getProperty("/tabBooksData");

				// Add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();

				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("title", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}

				// If there are filters from the tab selection, combine them
				if (aFilteredData && aFilteredData.length > 0) {
					// Create a new filter array based on the tab selection
					var tabFilter = new Filter("type", FilterOperator.Contains, this.getView().getModel().getProperty("/selectedTab"));
					aFilters.push(tabFilter);
				}

				// Update list binding with the combined filters
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

				var aFilteredData = this.getView().getModel().getProperty("/tabBooksData");

				// If there are filters from the tab selection, combine them
				if (aFilteredData && aFilteredData.length > 0) {
					// Create a new filter array based on the tab selection
					var tabFilter = new Filter("type", FilterOperator.Contains, this.getView().getModel().getProperty("/selectedTab"));
					aFilters.push(tabFilter);
				}

				this.oSF.getBinding("suggestionItems").filter(aFilters);
				this.oSF.suggest();
				this.getView().byId("searchField").setEnableSuggestions(false);
			},

			onRatingStyle: function (rating) {
				var oRatingText = this.getView().byId("ratingTextId");

				// Add the appropriate style class based on the rating
					if (rating >= 3.5) {
						var highText = new sap.m.Text({
							text: rating
						}
						)
						highText.addStyleClass("highRatingTextSytle");
						oRatingText.addItem(highText);
					} else {
						var lowText = new sap.m.Text({
							text: rating
						}
						)
						lowText.addStyleClass("lowRatingTextSytle");
						oRatingText.addItem(lowText);
					}
				
			}
		});
	});
