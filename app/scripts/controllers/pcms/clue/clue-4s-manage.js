'use strict';

/**
 * 潜客管理→线索管理→线索管理
 * create by wenfeng 2017/1/11
 *
 * @name pcmsApp.controller:Clue4sManageCtrl
 * @description
 * Controller of the pcmsApp
 */
angular.module('pcmsApp')
  .controller('Clue4sManageCtrl',
    function($scope, PAGE_CONST, REGEX, Util, $confirm, codeMasterService, HybridUiGrid, Clue4sManageEntity, $uibModal, ClueFileEntity, Clue4sManageNewEntity, Clue4sManageDeleteEntity, loginData) {

      //初始化页面
      var init = function() {
        $scope.filter = {};
        $scope.clueData = {};
        //混合分页相关信息对象
        $scope.hybridObj = new HybridUiGrid();
        $scope.hybridObj.beApi = Clue4sManageEntity.getAll;
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
        m_filter.sortType = 'desc';
        m_filter.sortFields = 'clue_id';
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
              $scope.clueData = row.entity;
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
          name: '线索编号',
          field: 'clueId',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '来源平台',
          field: 'clueOrigin',
          // cellFilter: 'codeMasterFilter:\'clueOrigin\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '来源店铺',
          field: 'dealerNm',
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
          name: '线索状态',
          field: 'clueStatus',
          cellFilter: 'codeMasterFilter:\'clueStatus\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '线索级别',
          field: 'clueLevel',
          // cellFilter: 'codeMasterFilter:\'clueLevel\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
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
          // cellFilter: 'codeMasterFilter:\'sex\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 60,
          enableColumnMenu: false,
        }, {
          name: '年龄',
          field: 'age',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 60,
          enableColumnMenu: false,
        }, {
          name: '移动电话',
          field: 'phone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '办公电话',
          field: 'companyPhone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '家庭电话',
          field: 'familyPhone',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '地址',
          field: 'address',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '邮编',
          field: 'zipcode',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '省份',
          field: 'province',
          // cellFilter: 'codeMasterFilter:\'province\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '城市',
          field: 'city',
          // cellFilter: 'codeMasterFilter:\'city\'',
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
        }, {
          name: '区域',
          field: 'area',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '职业',
          field: 'occupation',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '身份证号',
          field: 'idNo',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 160,
          enableColumnMenu: false,
        }, {
          name: '电子邮件',
          field: 'email',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '微信',
          field: 'weixin',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '微博',
          field: 'weibo',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '意向车型',
          field: 'modelName',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 80,
          enableColumnMenu: false,
        }, {
          name: '意向车型关注度',
          field: 'modelAttention',
          cellFilter: 'codeMasterFilter:\'modelAttention\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '意向型号',
          field: 'modelDetail',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '意向车型备注',
          field: 'modelComment',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '预计购车时间',
          field: 'preBuycarDate',
          cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '预计到店时间',
          field: 'preArriveDate',
          cellFilter: 'dateFilter:\'yyyy-MM-dd\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '购车预算',
          field: 'carBudget',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '购车用途',
          field: 'carUse',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '对比车型',
          field: 'rivalCar',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '信息来源',
          field: 'infoOrigin',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '备注',
          field: 'comment',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '来源活动',
          field: 'eventOrigin',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '活动类别',
          field: 'eventType',
          // cellFilter: 'codeMasterFilter:\'activityType\'',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '活动金额',
          field: 'eventMoney',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellRight',
          minWidth: 110,
          enableColumnMenu: false,
        }, {
          name: '活动验证码',
          field: 'eventCaptcha',
          headerCellClass: 'gridHeadCenter',
          cellClass: 'gridCellLeft',
          minWidth: 110,
          enableColumnMenu: false,
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

      var showModal = function (data) {
        // 传递参数
        var param = {};
        param.codeMaster = $scope.codeMaster;
        param.clueData = data.clueId ? angular.copy(data) : {clueOrigin:'4S店自有',dealerNm:'海马天猫店',clueStatus:'0'};

        // 弹出选择框
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/pcms/modal/clue-manage-modal.html',
          controller: 'ClueManageModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return param;
            }
          }
        });

        modalInstance.result.then(function (result) {
          if (result.clueId) {
            result.modifier = loginData.username;
            $scope.promise = Clue4sManageNewEntity.update(result,function (resp) {
              if('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1003', 'clue');
                load();
              } else {
                Util.putSysMsg('warning', '1110', 'clue');
              }
            });
          } else {
            result.delFlg = '0';
            result.dealerId = '100';
            result.businessType = '0';
            result.creator = loginData.username;
            result.modifier = loginData.username;
            $scope.promise = Clue4sManageNewEntity.create(result,function (resp) {
              if ('1'.equals(resp.status)) {
                Util.putSysMsg('success', '1002', 'clue');
                load();
              } else {
                Util.putSysMsg('warning', '1111', 'clue');
              }
            });
          }
        }, function () {
          console.log('cancel');
        });
      };

      //新建线索
      $scope.addBtnEvent = function () {
        showModal({});
      };

      //编辑
      $scope.editBtnEvent = function () {
        if($scope.clueData.clueId) {
          showModal($scope.clueData);
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //作废
      $scope.cancelBtnEvent = function () {

        if($scope.clueData.clueId) {
          // 呼出modal
          var modal = {};
          modal.text = '确定作废该条记录吗？';
          modal.title = '提示';

          $confirm(modal, {
            size: 'xs'
          })
            .then(function (param) {
              console.log(param);
                $scope.promise = Clue4sManageDeleteEntity.delete({clueId: $scope.clueData.clueId}, function (resp) {
                  if('1'.equals(resp.status)) {
                    Util.putSysMsg('success', '2103');
                    load();
                  } else {
                    Util.putSysMsg('warning', '2072');
                  }
                });
            });
        } else {
          Util.putSysMsg('warning','2002');
        }
      };

      //导入线索
      $scope.$watch('uploadFile', function (newValue) {
        if(newValue) {
          //上传文件
          $scope.promise = ClueFileEntity.upload(newValue)
            .then(function (resp) {
                console.log(resp);
              if ('1'.equals(resp.data.status)) {
                Util.putSysMsg('success', '1016');
                load();
              } else {
                Util.putSysMsg('warning', '1017');
              }
              }, angular.noop, angular.noop
            );
        }
      });

      // 重置
      $scope.reset = function () {
        $scope.filter = {};
      };

      //模板下载
      $scope.downloadBtnEvent = function () {
        window.location.href = 'data/线索导入模板.xls';
      };

      //导出
      $scope.exportBtnEvent =function () {
        var url = '/file/clue';
        if($scope.filter.clueStatus) {
          url = url + '?clueStatus=' + $scope.filter.clueStatus;
        } else {
          url = url + '?clueStatus=' + '';
        }
        if($scope.filter.clueLevel) {
          url = url + '&clueLevel=' + $scope.filter.clueLevel;
        } else {
          url = url + '&clueLevel=' + '';
        }
        if($scope.filter.clueOrigin) {
          url = url + '&clueOrigin=' + $scope.filter.clueOrigin;
        } else {
          url = url + '&clueOrigin=' + '';
        }
        Util.exportFromUrl(url);
      };

      load();
    });
