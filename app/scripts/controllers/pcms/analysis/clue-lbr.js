'use strict';

/**
 * 潜客管理→统计分析→销售机会成交率
 * create by wenfeng 2017/1/11
 *
 * @name pcmsApp.controller:TrackDefeatCtrl
 * @description
 * #TrackDefeatCtrl
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('ClueLbrCtrl',
    function($scope, PAGE_CONST, REGEX, Util, CommonModalSearch, codeMasterService, ClueLbrEntity, HybridUiGrid) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = ClueLbrEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

        $scope.filter.beginTime = new Date(moment().subtract(1, 'months'));
        $scope.filter.endTime = new Date();
      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);
        m_filter.beginTime = m_filter.beginTime ? Util.formatDate(m_filter.beginTime,'YYYY-MM-DD HH:mm:ss') : '';
        m_filter.endTime = m_filter.endTime ? Util.formatDate(m_filter.endTime,'YYYY-MM-DD HH:mm:ss') : '';

        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        if (result) {
          var rows = result.data ? result.data : [];
          var total = rows.length;

          console.log('rows:',rows);
          if (rows) {
            for (var index in rows) {
              // rows[index].sex = String(rows[index].sex);
            }

            $scope.hybridObj.processAfterGetDataFromBeCommon(rows, total);
          }
        }
      };

      angular.extend($scope.hybridObj.gridOptions, {
        paginationPageSize: PAGE_CONST.pageList[1],
        enableSorting: true,
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
            }
          });

          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.promise = $scope.hybridObj.onPaginationChanged(newPage, pageSize);
          });
        },
        // isRowSelectable: function (row) {
        //   if ($scope.hybridObj.selectedRow.entity) {
        //     var key = 'pc_id';
        //     var keyVal = $scope.hybridObj.selectedRow.entity[key];
        //
        //     $scope.hybridObj.selectRow(key, keyVal, row);
        //   }
        // },
        columnDefs: [{
          name: '序号',
          field: 'idx',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          width: 50,
          enableColumnMenu: false,
        }, {
        //   name: '省份',
        //   field: 'province',
        //   cellFilter: 'codeMasterFilter:\'province\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 80,
        //   enableColumnMenu: false,
        // }, {
        //   name: '城市',
        //   field: 'city',
        //   cellFilter: 'codeMasterFilter:\'city\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '4S店',
        //   field: 'dealerNm',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
          name: '成交数量',
          field: 'successCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '跟进数量',
          field: 'followCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '待处理数量',
          field: 'orderCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '转意向客户数量',
          field: 'orderCount',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '销售机会成交率',
          field: 'successRatio',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 60,
          enableColumnMenu: false,
        }]
      });

      //查询
      $scope.searchBtnEvent = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      //导出
      $scope.exportBtnEvent =function () {
        var url = '/ststcs/exportDRSalesChanceDealRpt';
        if($scope.filter.beginTime) {
          url = url + '?beginTime=' + Util.formatDate($scope.filter.beginTime,'YYYY-MM-DD');
        } else {
          url = url + '?beginTime=' + '';
        }
        if($scope.filter.endTime) {
          url = url + '&endTime=' + Util.formatDate($scope.filter.beginTime,'YYYY-MM-DD');
        } else {
          url = url + '&endTime=' + '';
        }
        Util.exportFromUrl(url);
      };

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      load();
    });
