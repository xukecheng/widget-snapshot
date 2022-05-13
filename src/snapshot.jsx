import React from "react";
import {
  useRecordsAll,
  useFields,
  useActiveViewId,
  useDatasheet,
  useCloudStorage,
} from "@vikadata/widget-sdk";
import { Button } from "@vikadata/components";

export const Snapshot = () => {
  const datasheet = useDatasheet();

  const viewId = useActiveViewId();
  const records = useRecordsAll();
  const fields = useFields(viewId);

  const recordIds = new Array();
  const customRecords = new Array();

  console.log(records);

  records.map((record) => {
    recordIds.push(record.id);
    const valuesMap = new Object();
    fields.map((field) => {
      if (field.type === "Formula" || field.type === "AutoNumber") {
        return;
      }
      valuesMap[field.id] =
        field.type != "MultiSelect" && field.type != "MagicLink"
          ? record.getCellValue(field.id)
          : record.getCellValueString(field.id)
          ? record.getCellValueString(field.id).split(",")
          : record.getCellValueString(field.id);
    });
    customRecords.push({ id: record.id, valuesMap });
  });
  const [storageMap, setStorageMap, editable] = useCloudStorage(
    datasheet.datasheetId + "storageMap",
    {}
  );
  const [storeRecordIds] = useCloudStorage(
    datasheet.datasheetId + "recordIds",
    recordIds
  );
  console.log(storageMap);

  const [storageTime, setStorageTime] = useCloudStorage(
    datasheet.datasheetId + "storageTime",
    null
  );

  function todayTime() {
    var date = new Date();
    var curYear = date.getFullYear();
    var curMonth = date.getMonth() + 1;
    var curDate = date.getDate();
    if (curMonth < 10) {
      curMonth = "0" + curMonth;
    }
    if (curDate < 10) {
      curDate = "0" + curDate;
    }
    var curHours = date.getHours();
    var curMinutes = date.getMinutes();
    var curSeconds = date.getSeconds();
    var curtime =
      curYear +
      "-" +
      curMonth +
      "-" +
      curDate +
      " " +
      curHours +
      ":" +
      curMinutes +
      ":" +
      curSeconds;
    return curtime;
  }

  function saveRecords() {
    setStorageMap(customRecords);
    setStorageTime(todayTime());
  }

  function setRecordsBack(data) {
    if (datasheet.checkPermissionsForSetRecords(data).acceptable) {
      datasheet.setRecords(data);
      deleteNewRecords();
    }
  }

  function deleteNewRecords() {
    records.map((record) => {
      console.log("recordId:" + record.id);
      console.log(recordIds);
      if (!storeRecordIds.includes(record.id)) {
        datasheet.deleteRecord(record.id);
      }
    });
  }
  return (
    <div>
      <div style={{ display: "flex" }}>
        <Button
          color="primary"
          disable={!editable}
          onClick={() => saveRecords()}
          style={{ width: "100px" }}
        >
          保存
        </Button>
        {storageTime && (
          <div style={{ paddingLeft: "10px" }}>
            <p style={{ marginBottom: "0" }}>上次保存时间：</p>
            <p style={{ marginBottom: "0" }}>{storageTime}</p>
          </div>
        )}
      </div>
      <br />
      <Button
        variant="jelly"
        color="primary"
        onClick={() => setRecordsBack(storageMap)}
        style={{ width: "100px" }}
      >
        还原数据
      </Button>
    </div>
  );
};
