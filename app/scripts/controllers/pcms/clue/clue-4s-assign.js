'use strict';

/**
 * 潜客管理→线索管理(总部)→线索指派
 * create by wenfeng 2017/1/11
 *
 * @name pcmsApp.controller:Clue4sAssignCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('Clue4sAssignCtrl',
    function($scope, PAGE_CONST, REGEX, Util, Clue4sAssignAutoEntity, codeMasterService, $uibModal, Clue4sAssignEntity, HybridUiGrid, Clue4sAssignHandelEntity) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.chanceData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = Clue4sAssignEntity.getAll;
        $scope.hybridObj.filter = {};
        $scope.hybridObj.htmlId = 'mainGrid';
        // 正则表达式
        $scope.pattern = REGEX;

        // 取得编码表
        $scope.codeMaster = codeMasterService.get();

      };
      init();

      //从后台取数据(前处理)
      $scope.hybridObj.processBeforeGetDataFromBe = function () {
        var m_filter = $scope.hybridObj.processBeforeGetDataFromBeCommon();

        // m_filter.first_comedateFrom = m_filter.first_comedateFrom ? Util.formatDate(m_filter.first_comedateFrom, 'YYYY-MM-DD HH:mm:ss') : '';
        // m_filter.first_comedateTo = m_filter.first_comedateTo ? Util.formatDate(m_filter.first_comedateTo, 'YYYY-MM-DD HH:mm:ss') : '';

        console.log('$scope.hybridObj.processBeforeGetDataFromBe:', m_filter);

        return m_filter;
      };

      //从后台取数据(后处理)
      $scope.hybridObj.processAfterGetDataFromBe = function (result) {
        console.log('$scope.hybridObj.processAfterGetDataFromBe→cb→result', result);

        if (result) {
          var rows = result.data;
          var total = result.count;

          console.log('rows:',rows);
          if (rows) {
            for (var index in rows) {
              // rows[index].dealerNm = rows[index].dealerId;
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
              $scope.chanceData = row.entity;
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
          type: 'number',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellCenter',
          width: 50,
          enableColumnMenu: false,
        }, {
          name: '机会编号',
          field: 'chanceId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 70,
          enableColumnMenu: false,
        }, {
          name: '机会来源',
          field: 'chanceOrigin',
          cellFilter: 'codeMasterFilter:\'clueOrigin\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '业务类别',
          field: 'businessType',
          cellFilter: 'codeMasterFilter:\'businessType\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '机会状态',
          field: 'chanceStatus',
          cellFilter: 'codeMasterFilter:\'chanceStatus\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '机会级别',
          field: 'chanceLevel',
          // cellFilter: 'codeMasterFilter:\'chanceLevel\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型',
          field: 'intentionModel',
          // cellFilter: 'codeMasterFilter:\'intentionModel\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型关注度',
          field: 'modelAttention',
          cellFilter: 'codeMasterFilter:\'modelAttention\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '目标车型备注',
          field: 'intentionDetail',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 160,
          enableColumnMenu: false,
        }, {
          name: '客户姓名',
          field: 'customerName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '性别',
          field: 'sex',
          cellFilter: 'codeMasterFilter:\'sex\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '手机',
          field: 'phone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '省份',
          field: 'province',
          cellFilter: 'codeMasterFilter:\'province\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '城市',
          field: 'city',
          cellFilter: 'codeMasterFilter:\'city\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '区',
          field: 'district',
          // cellFilter: 'codeMasterFilter:\'area\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        // }, {
        //   name: '区域',
        //   field: 'area',
        //   cellFilter: 'codeMasterFilter:\'area\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '职业',
        //   field: 'occupation',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '身份证号',
        //   field: 'idNo',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '电子邮件',
        //   field: 'email',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '微信',
        //   field: 'wechat',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '微博',
        //   field: 'weibo',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '预计购车时间',
        //   field: 'preBuyCarDate',
        //   cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellRight',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '预计到店时间',
        //   field: 'preArriveDate',
        //   cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellRight',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '购车预算',
        //   field: 'carBudget',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellRight',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '购车用途',
        //   field: 'carUse',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '对比车型',
        //   field: 'rivalCar',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '信息来源',
        //   field: 'infoOrigin',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '备注',
        //   field: 'comment',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '来源活动',
        //   field: 'eventOrigin',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '活动类别',
        //   field: 'eventType',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '活动金额',
        //   field: 'eventMoney',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellRight',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        // }, {
        //   name: '活动验证码',
        //   field: 'eventCaptcha',
        //   headerCellClass: 'gridHeadCenter',
        //   cellClass: 'gridCellLeft',
        //   minWidth: 110,
        //   enableColumnMenu: false,
        }]
      });

      //查询
      $scope.searchBtnEvent = function () {
        $scope.hybridObj.filter = $scope.filter;
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      //加载数据
      var load = function () {
        $scope.hybridObj.filter = {};
        $scope.hybridObj.feData = [];
        $scope.promise = $scope.hybridObj.getData();
      };

      //分配
      $scope.allotBtnEvent = function () {

        if('2'.equals($scope.chanceData.chanceStatus)) {
          Util.putSysMsg('warning', '该机会已被分配');
        } else {
          if ($scope.chanceData.chanceId) {
            // 传递参数
            var mParam = {};
            // 弹出选择框
            var modalInstance = $uibModal.open({
              animation: false,
              templateUrl: 'views/pcms/modal/assign-modal.html',
              controller: 'AssignModalCtrl',
              size: 'md',
              resolve: {
                data: function () {
                  return mParam;
                }
              }
            });
            modalInstance.result.then(function (param) {
              var data = {};
              data.allocType = 'sale';
              data.chanceId = $scope.chanceData.chanceId;
              data.chanceStatus = $scope.chanceData.chanceStatus;
              data.dealerId = $scope.chanceData.dealerId;
              data.salesId = param.salesId;
              $scope.promise = Clue4sAssignHandelEntity.update(data, function (resp) {
                if ('1'.equals(resp.status)) {
                  Util.putSysMsg('success', '1015');
                  load();
                } else {
                  Util.putSysMsg('warning', '1113');
                }
              });
            });
          } else {
            Util.putMainMsg('warning', '2002');
          }
        }
      };

      //自动分配
      $scope.autoAllotBtnEvent = function () {
        $scope.promise = Clue4sAssignAutoEntity.create({}, function (resp) {
          if('1'.equals(resp.status)) {
            Util.putSysMsg('success', '自动分配完成');
            load();
          } else {
            Util.putSysMsg('warning', '自动分配失败');
          }
        });
      };

      load();
    });
