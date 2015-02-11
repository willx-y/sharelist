<ion-view view-title="Lists" ng-controller="ListsCtrl"> 
    <ion-nav-bar class="bar-positive">
        <ion-nav-back-button class="button-icon ion-arrow-left-c">
        </ion-nav-back-button>
    </ion-nav-bar> 
    <ion-content class="padding">
        <form ng-submit="addNewList();" > 
            <input id="list_title_input" ng-model="new_list.title" placeholder="Type to add new list" />
        </form>
        <ion-list>
            <ion-item id="{{ statusClass(list.status) }}" ng-click="viewDetail(list._id);" ng-repeat="list in lists">
                <span id="list-title">{{list.title}}</span>
                <ion-option-button class="button-positive"
                       ng-click="accomplish(list._id)">
                  完成
                </ion-option-button>
                <ion-option-button class="button-info"
                                   ng-click="delete(list._id)">
                  删除
                </ion-option-button>
            </ion-item>
        </ion-list>
    </ion-content>
</ion-view>
