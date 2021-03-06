'use strict';
/**
 * Created by huangcheng on 2017/2/16.
 */
/**
 * 潜客管理→销售机会→转订单
 * @ngdoc function
 * @name pcmsApp.controller:ToOrderModel
 * @description
 * # ToOrderModel
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ToOrderModel',
    function ($scope, $uibModalInstance, Util, REGEX, data) {
      $scope.tagData = data.tagData;
      // 页面错误信息
      $scope.alerts = [];
      // 正则表达式
      $scope.pattern = REGEX;
      // 确定
      $scope.returnData = function () {
        $uibModalInstance.close($scope.tagData);
      };

      // 确定
      $scope.ok = function () {
        $scope.returnData($scope.tagData);
      };

      // 取消
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      //加载数据
      var load = function () {

      };
      load();
    });
