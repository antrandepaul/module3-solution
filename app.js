(function(){
    'use strict';

    angular.module('NarrowItDownApp',[])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems);
        
        
        function FoundItems() {
            var ddo = {
                scope: {
                    items: '<',
                    onRemove: '&'
                },
                controller:NarrowItDownController,
                controllerAs: 'list',
                bindToController: true,
                templateUrl: 'foundItems.html',
                transclude: true,
                link:FoundItemsLink
            };
            return ddo;
        }

        function FoundItemsLink(scope, element, attrs, controller){
            scope.$watch('list.isFound()', function(newVal, oldVal){
                console.log("old:" + oldVal + " new:" + newVal);
                if (newVal === false) 
                    displayError();
                else hideError();
            });

            function displayError() {
                element.find("div").css("display","block");
            }

            function hideError() {
                element.find("div").css("display","none");
            }
        };
        

        NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService) {
            var narrowItDown = this;
            narrowItDown.warning = "Nothing Found";
            narrowItDown.found = MenuSearchService.getItems();

            narrowItDown.getMatchedMenuItems = function (searchTerm) {
                 MenuSearchService.getMatchedMenuItems(searchTerm);
            }
           
            narrowItDown.removeItem = function (index){
                MenuSearchService.removeItem(index);
            }
            narrowItDown.isFound = function() {
                return narrowItDown.found.length > 0;
            }
        }

       
        MenuSearchService.$inject = ['$http'];
        function MenuSearchService($http) {
            var service = this;

            var foundItems = [];
            service.getItems = function() {
                return foundItems;
            };
            service.removeItem = function(index){
                foundItems.splice(index, 1);
            };
            service.getMatchedMenuItems = function (searchTerm) {
                //empty foundItems array to start over
                foundItems.splice(0,foundItems.length);
                $http({
                    url:("https://davids-restaurant.herokuapp.com/menu_items.json")
                }).then(function(response){
                    
                    for (var i=0; i<response.data.menu_items.length;i++) {
                        var item = response.data.menu_items[i];
                        if (item.description.indexOf(searchTerm) >0) foundItems.push(item);
                    }
                    
                })
                .catch(function(error){
                    console.log("Something went wrong!" + error);
                });
            };
            
        }
})();
