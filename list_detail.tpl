<ion-view view-title="{{ list_title }}"  ng-controller="ListDetailCtrl"> 
    <ion-nav-bar class="bar-positive">
        <ion-nav-back-button ng-click="goBack()" class="button-icon ion-arrow-left-c">
            Back
        </ion-nav-back-button>
    </ion-nav-bar>  
    <ion-content class="padding">
        <form ng-submit="addNewItem()" > 
            <input id="item_title_input" ng-model="new_item.title" placeholder="Type to add new item" />
        </form>
        <ion-list>
          <ion-item ng-repeat="item in top_items">
            <span id="item-title">{{item.title}}</span>
          </ion-item>
        </ion-list>
    </ion-content>
</ion-view>