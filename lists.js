// Lists = new Mongo.Collection("lists");
// ListItems = new Mongo.Collection("list_items");

var Lists = new Meteor.Collection("lists");
var GroundLists = new Ground.Collection(Lists, "lists");
var ListItems = new Meteor.Collection('list_items');
var GroundListItems = new Ground.Collection(ListItems, 'list_items');



if (Meteor.isClient) {
  // define pages in our app, includes Lists, ListDetail, SharedLists
  var app = angular.module('ShareList', [
    'angular-meteor',
    'ui.router',
    'ionic',
    // 'ngCordova.plugins.datePicker'
  ]);

  app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    // $locationProvider.html5Mode(true);

    $stateProvider
      .state('lists', {
        url: '/lists',
        templateUrl: 'lists.tpl',
        controller: 'ListsCtrl'
      })
      .state('listdetail', {
        url: '/lists/:list_id',
        templateUrl: 'list_detail.tpl',
        controller: 'ListDetailCtrl',
        /*resolve: {
          new_list: function($stateParams){
             return $stateParams._id;
          }
        }*/
      });

      $urlRouterProvider.otherwise("/lists");
    }]);

  function onReady() {
    angular.bootstrap(document, ['ShareList']);
  }

  if (Meteor.isCordova) {
    angular.element(document).on("deviceready", onReady);
  } else {
    angular.element(document).ready(onReady);
  }


  app.controller("ListsCtrl", ['$scope', '$state', 
    function($scope, $state) {
      $scope.lists = GroundLists.find({status: {$ne: 2}}, {sort: {createdAt: -1}}).fetch();
      $scope.new_list = {
        title: '',
        description: ''
      };
      $scope.addNewList = function () {
        title = $scope.new_list.title;
        if (title) {  
          new_list_id = GroundLists.insert({
            title: title,
            createdAt: new Date(),
            status: 0,
            private: "y"
          });
          $scope.lists = GroundLists.find({status: {$ne: 2}}, {sort: {createdAt: -1}}).fetch();
          $scope.new_list.title = '';
          $scope.new_list.description = '';   
          // alert(new_list.title);   
          $state.go('listdetail', {'list_id': new_list_id});
        }
      };
      $scope.viewDetail = function (list_id) {
        $state.go('listdetail', {'list_id': list_id});
      };

      $scope.accomplish = function (list_id) {
        GroundLists.update({_id: list_id}, {$set: {status: 1}});
        $scope.lists = GroundLists.find({status: {$ne: 2}}, {sort: {createdAt: -1}}).fetch();
      }

      $scope.delete = function (list_id) {
        GroundLists.update({_id: list_id}, {$set: {status: 2}});
        $scope.lists = GroundLists.find({status: {$ne: 2}}, {sort: {createdAt: -1}}).fetch();
      }

      $scope.statusClass = function (status) {
        status_list = ['init', 'accomplished', 'deleted'];
        if (status >= 0 && status <= 2)
          return status_list[status];
        return '';
      }
  }]);

  app.controller("ListDetailCtrl", ['$scope', '$state', '$stateParams', '$ionicNavBarDelegate', '$ionicHistory',
    function($scope, $state, $stateParams, $ionicNavBarDelegate, $ionicHistory){

      list_id = $stateParams.list_id;
      current_list = GroundLists.findOne({_id: list_id});
      $scope.list_title = current_list.title;
      $scope.top_items = GroundListItems.find({status: {$ne: 2}, level: 1, list: list_id}, {sort: {createdAt: -1}}).fetch();
      $scope.new_item = {
        'title': '',
      }

      $scope.addNewItem = function () {
        title = $scope.new_item.title;
        $scope.new_item.title = '';
        if (title) {
          new_list_id = GroundListItems.insert({
            title: title,
            createdAt: new Date(),
            status: 0,
            private: "y",
            list: list_id,
            level: 1,
          });
          $scope.top_items = GroundListItems.find({status: {$ne: 2}, level: 1, list: list_id}, {sort: {createdAt: -1}}).fetch();
        }
      }
      if (!$ionicNavBarDelegate.showBackButton()) { // history lost, force to show back button.
        $ionicNavBarDelegate.showBackButton(true);
      }
      console.log($ionicHistory.backView());
      $scope.goBack = function() {
        if (!$ionicHistory.backView()) {
          $state.go('lists');
        } else {
          $ionicHistory.goBack();
        }
      };
    }
  ]);
}

Meteor.methods({
  addList: function (title, onSuccess) {
    console.log("add new list " + title + " now");
    if (title) {
      list_id = Lists.insert({
        title: title,
        createdAt: new Date(),
        status: 0,
        private: "y"
      }, onSuccess);
      console.log("list_id: " + list_id);
    }
  },
  deleteList: function (list_id) {
    Lists.update({_id: list_id}, {$set: {status: '2'}});
  }
})

