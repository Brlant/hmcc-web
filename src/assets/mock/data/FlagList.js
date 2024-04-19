// 器械标识的模拟数据
import {getUrlParams, getUrlPathId} from '@/tools/utils'
import Mock from 'mockjs'

const {mock, Random} = Mock;

export default {
  getMockList: (options) => {
    // debugger
    const urlParams = getUrlParams(options.url);
    return mock({
      "pageNo|1-10": urlParams.pageNo, //页码
      "pageSize": urlParams.pageSize, //页大小
      "count|1-50": 3, //数量
      "start": 0,
      "first": 1,
      "last": 1,
      "firstPage": true,
      "lastPage": true,
      "list|1-10": [
        {
          "historyDeviceId": "@uuid",
          "medicalDeviceId": "1",
          "versionNumber": "v1.0.0",
          "versionTime": "2024-01-11",
          "correctionNumber": "",
          "correctionTime": "",
          "correctionRemark": "",
          "deviceRecordKey": "",
          "ZXXSDYCPBS": "",
          "BSSJZT": "123",
          "ZXXSDYZSYDYDSL": "",
          "SYDYCPBS": "",
          "CPBSBMTXMC": "",
          "SFYBTZJBS": 1,
          "BTCPBSYZXXSDYCPBSSFYZ": 1,
          "BTCPBS": "",
          "CPBSFBRQ": "2024-01-11",
          "BSZT": 1,
          "SFYZCBAYZ": "",
          "ZCBACPBS": "1",
          "CPMCTYMC": "产品1",
          "SPMC": "商品名称1",
          "GGXH": "绿色",
          "SFWBLZTLCP": 1,
          "CPMS": "",
          "CPHHHBH": "",
          "CPLX": "",
          "FLBM": "",
          "YFLBM": "",
          "YLQXZCRBARMC": "张三",
          "YLQXZCRBARYWMC": "",
          "TYSHXYDM": "",
          "ZCZBHHZBAPZBH": "10086",
          "HCHZSB": "",
          "SFBJWYCXSY": 1,
          "ZDCFSYCS": 1,
          "SFWWJBZ": "",
          "SYQSFXYJXMJ": "",
          "MJFS": "",
          "YBBM": "",
          "CGZMRAQXGXX": "",
          "TSCCHCZTJ": "",
          "TSCCSM": "",
          "SCBSSFBHPH": "",
          "SCBSSFBHXLH": "",
          "SCBSSFBHSCRQ": "",
          "SCBSSFBHSXRQ": "",
          "QTXXDWZLJ": "",
          "TSRQ": "",
          "contactList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "QYLXRYX": "",
              "QYLXRDH": "",
              "QYLXRCZ": ""
            }
          ],
          "packingInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "BZCPBS": "",
              "BZNHXYJBZCPBS": "",
              "BZNHXYJCPBSSL": 1,
              "CPBZJB": ""
            }
          ],
          "storageInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "CCHCZTJ": "",
              "ZDZ": "",
              "ZGZ": "",
              "JLDW": ""
            }
          ],
          "clinicalInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "LCSYCCLX": "",
              "CCZ": 1,
              "CCDW": ""
            }
          ]
        }
      ],
      "next": 1,
      "disabled": false,
      "totalPage": 1,
      "notCount": false,
      "prev": 1
    })
  },
  getMockHistoryList: (options) => {
    // debugger
    const urlParams = getUrlParams(options.url);
    return mock({
      "pageNo|1-10": urlParams.pageNo, //页码
      "pageSize": urlParams.pageSize, //页大小
      "count|1-50": 3, //数量
      "start": 0,
      "first": 1,
      "last": 1,
      "firstPage": true,
      "lastPage": true,
      "list|1-10": [
        {
          "historyDeviceId": "@uuid",
          "medicalDeviceId": "1",
          "versionNumber": "v1.0.0",
          "versionTime": "2024-01-11",
          "correctionNumber": "",
          "correctionTime": "",
          "correctionRemark": "",
          "deviceRecordKey": "",
          "ZXXSDYCPBS": "",
          "BSSJZT": "123",
          "ZXXSDYZSYDYDSL": "",
          "SYDYCPBS": "",
          "CPBSBMTXMC": "",
          "SFYBTZJBS": 1,
          "BTCPBSYZXXSDYCPBSSFYZ": 1,
          "BTCPBS": "",
          "CPBSFBRQ": "2024-01-11",
          "BSZT": 1,
          "SFYZCBAYZ": "",
          "ZCBACPBS": "1",
          "CPMCTYMC": "产品1",
          "SPMC": "商品名称1",
          "GGXH": "绿色",
          "SFWBLZTLCP": 1,
          "CPMS": "",
          "CPHHHBH": "",
          "CPLX": "",
          "FLBM": "",
          "YFLBM": "",
          "YLQXZCRBARMC": "张三",
          "YLQXZCRBARYWMC": "",
          "TYSHXYDM": "",
          "ZCZBHHZBAPZBH": "10086",
          "HCHZSB": "",
          "SFBJWYCXSY": 1,
          "ZDCFSYCS": 1,
          "SFWWJBZ": "",
          "SYQSFXYJXMJ": "",
          "MJFS": "",
          "YBBM": "",
          "CGZMRAQXGXX": "",
          "TSCCHCZTJ": "",
          "TSCCSM": "",
          "SCBSSFBHPH": "",
          "SCBSSFBHXLH": "",
          "SCBSSFBHSCRQ": "",
          "SCBSSFBHSXRQ": "",
          "QTXXDWZLJ": "",
          "TSRQ": "",
          "contactList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "QYLXRYX": "",
              "QYLXRDH": "",
              "QYLXRCZ": ""
            }
          ],
          "packingInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "BZCPBS": "",
              "BZNHXYJBZCPBS": "",
              "BZNHXYJCPBSSL": 1,
              "CPBZJB": ""
            }
          ],
          "storageInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "CCHCZTJ": "",
              "ZDZ": "",
              "ZGZ": "",
              "JLDW": ""
            }
          ],
          "clinicalInfoList": [
            {
              "medicalDeviceId": "",
              "deviceRecordKey": "",
              "LCSYCCLX": "",
              "CCZ": 1,
              "CCDW": ""
            }
          ]
        }
      ],
      "next": 1,
      "disabled": false,
      "totalPage": 1,
      "notCount": false,
      "prev": 1
    })
  },
  getMockDetails(options) {
    return mock({
      "id": getUrlPathId(options.url),
      "historyDeviceId": "@uuid",
      "medicalDeviceId": "1",
      "versionNumber": "v1.0.0",
      "versionTime": "2024-01-11",
      "correctionNumber": "",
      "correctionTime": "",
      "correctionRemark": "",
      "deviceRecordKey": "",
      "ZXXSDYCPBS": "",
      "BSSJZT": "123",
      "ZXXSDYZSYDYDSL": "",
      "SYDYCPBS": "",
      "CPBSBMTXMC": "",
      "SFYBTZJBS": 1,
      "BTCPBSYZXXSDYCPBSSFYZ": 1,
      "BTCPBS": "",
      "CPBSFBRQ": "2024-01-11",
      "BSZT": 1,
      "SFYZCBAYZ": "",
      "ZCBACPBS": "1",
      "CPMCTYMC": "产品1",
      "SPMC": "商品名称1",
      "GGXH": "绿色",
      "SFWBLZTLCP": 1,
      "CPMS": "",
      "CPHHHBH": "",
      "CPLX": "",
      "FLBM": "",
      "YFLBM": "",
      "YLQXZCRBARMC": "张三",
      "YLQXZCRBARYWMC": "",
      "TYSHXYDM": "",
      "ZCZBHHZBAPZBH": "10086",
      "HCHZSB": "",
      "SFBJWYCXSY": 1,
      "ZDCFSYCS": 1,
      "SFWWJBZ": "",
      "SYQSFXYJXMJ": "",
      "MJFS": "",
      "YBBM": "",
      "CGZMRAQXGXX": "",
      "TSCCHCZTJ": "",
      "TSCCSM": "",
      "SCBSSFBHPH": "",
      "SCBSSFBHXLH": "",
      "SCBSSFBHSCRQ": "",
      "SCBSSFBHSXRQ": "",
      "QTXXDWZLJ": "",
      "TSRQ": "",
      "contactList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "QYLXRYX": "",
          "QYLXRDH": "",
          "QYLXRCZ": ""
        }
      ],
      "packingInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "BZCPBS": "",
          "BZNHXYJBZCPBS": "",
          "BZNHXYJCPBSSL": 1,
          "CPBZJB": ""
        }
      ],
      "storageInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "CCHCZTJ": "",
          "ZDZ": "",
          "ZGZ": "",
          "JLDW": ""
        }
      ],
      "clinicalInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "LCSYCCLX": "",
          "CCZ": 1,
          "CCDW": ""
        }
      ]
    })
  },
  getMockHistoryDetails(options) {
    return mock({
      "id": getUrlPathId(options.url),
      "historyDeviceId": "@uuid",
      "medicalDeviceId": "1",
      "versionNumber": "v1.0.0",
      "versionTime": "2024-01-11",
      "correctionNumber": "",
      "correctionTime": "",
      "correctionRemark": "",
      "deviceRecordKey": "",
      "ZXXSDYCPBS": "",
      "BSSJZT": "123",
      "ZXXSDYZSYDYDSL": "",
      "SYDYCPBS": "",
      "CPBSBMTXMC": "",
      "SFYBTZJBS": 1,
      "BTCPBSYZXXSDYCPBSSFYZ": 1,
      "BTCPBS": "",
      "CPBSFBRQ": "2024-01-11",
      "BSZT": 1,
      "SFYZCBAYZ": "",
      "ZCBACPBS": "1",
      "CPMCTYMC": "产品1",
      "SPMC": "商品名称1",
      "GGXH": "绿色",
      "SFWBLZTLCP": 1,
      "CPMS": "",
      "CPHHHBH": "",
      "CPLX": "",
      "FLBM": "",
      "YFLBM": "",
      "YLQXZCRBARMC": "张三",
      "YLQXZCRBARYWMC": "",
      "TYSHXYDM": "",
      "ZCZBHHZBAPZBH": "10086",
      "HCHZSB": "",
      "SFBJWYCXSY": 1,
      "ZDCFSYCS": 1,
      "SFWWJBZ": "",
      "SYQSFXYJXMJ": "",
      "MJFS": "",
      "YBBM": "",
      "CGZMRAQXGXX": "",
      "TSCCHCZTJ": "",
      "TSCCSM": "",
      "SCBSSFBHPH": "",
      "SCBSSFBHXLH": "",
      "SCBSSFBHSCRQ": "",
      "SCBSSFBHSXRQ": "",
      "QTXXDWZLJ": "",
      "TSRQ": "",
      "contactList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "QYLXRYX": "",
          "QYLXRDH": "",
          "QYLXRCZ": ""
        }
      ],
      "packingInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "BZCPBS": "",
          "BZNHXYJBZCPBS": "",
          "BZNHXYJCPBSSL": 1,
          "CPBZJB": ""
        }
      ],
      "storageInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "CCHCZTJ": "",
          "ZDZ": "",
          "ZGZ": "",
          "JLDW": ""
        }
      ],
      "clinicalInfoList": [
        {
          "medicalDeviceId": "",
          "deviceRecordKey": "",
          "LCSYCCLX": "",
          "CCZ": 1,
          "CCDW": ""
        }
      ]
    })
  },
}
