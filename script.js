var token = '90932995|-31949325390402779|90949686';
var dbname = 'SCHOOL-DB';
var relation = "STUDENT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";
function resetForm() {
    $("#roll-no").val('')
    $("#full-name").val('');
    $("#class").val('');
    $("#birth-date").val('');
    $("#address").val('');
    $("#enrollment-date").val('');
}

function disableAll() {
    resetForm();
    $("#roll-no").prop("disabled", false);
    $("#roll-no").focus();
    $("#full-name").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birth-date").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollment-date").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
}
disableAll();
function executeCommand(reqString, apiEndPointUrl) {
    var url = baseUrl + apiEndPointUrl;
    var jsonObj;
    
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}
function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

function find(ele) {
    var roll = ele.value;
    var obj = {
        Roll_No: roll
    };
    var jsnobj = JSON.stringify(obj);
    var request = createGET_BY_KEYRequest(token, dbname, relation, jsnobj);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(request, "/api/irl");
    jQuery.ajaxSetup({ async: true });
    if (res.status == 400) {
        $("#full-name").prop("disabled", false);
        $("#full-name").focus();
        $("#class").prop("disabled", false);
        $("#birth-date").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollment-date").prop("disabled", false);
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
    } else {
        $("#roll-no").prop("disabled", true);
        $("#full-name").prop("disabled", false);
        $("#class").prop("disabled", false);
        $("#birth-date").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollment-date").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#save").prop("disabled", true);
        $("#update").prop("disabled", false);
        // console.log(res);
        var data = JSON.parse(res.data).record;
        // console.log(data);
        $("#full-name").val(data.Full_Name);
        $("#class").val(data.Class);
        $("#full-name").val(data.Birth_Date);
        $("#address").val(data.Address);
        $("#enrollment-date").val(data.Enrollment_Date);
    }
}
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}
function saveData() {
    $("#ajax").html("wait");
    var roll = $("#roll-no").val();
    var name = $("#full-name").val()
    var cls = $("#class").val();
    var dob = $("#birth-date").val();
    var addr = $("#address").val();
    var doe = $("#enrollment-date").val();
    if(roll==''){
        $("#roll-no").focus();
        return;
    }
    if(name==''){
        $("#full-name").focus();
        return;
    }if(cls==''){
        $("#class").focus();
        return;
    }if(dob==''){
        $("#birth-date").focus();
        return;
    }if(addr==''){
        $("#address").focus();
        return;
    }if(doe==''){
        $("#enrollment-date").focus();
        return;
    }
    var obj = {
        Roll_No: roll,
        Full_Name: name,
        Class: cls,
        Birth_Date: dob,
        Address: addr,
        Enrollment_Date: doe
    };
    var jsonobj = JSON.stringify(obj);
    var req = createPUTRequest(token, jsonobj, dbname, relation);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml");
    jQuery.ajaxSetup({ async: true });
    disableAll();
}
function createSETRequest(token, jsonStr, dbName, relName, type, primaryKey, uniqueKeys, foreignKeys) {
    if (type === undefined) {
        type = "DEFAULT";
    }
    var req = {
        token: token,
        cmd: "SET",
        dbName: dbName,
        rel: relName,
        type: type,
        jsonStr: JSON.parse(jsonStr)
    };
    if (primaryKey !== undefined) {
        req.primaryKey = primaryKey;
    }
    if (uniqueKeys !== undefined) {
        req.uniqueKeys = uniqueKeys;
    }
    if (foreignKeys !== undefined) {
        req.foreignKeys = foreignKeys;
    }
    req = JSON.stringify(req);
    return req;
}

function updateData(){
    var roll = $("#roll-no").val();
    var name = $("#full-name").val()
    var cls = $("#class").val();
    var dob = $("#birth-date").val();
    var addr = $("#address").val();
    var doe = $("#enrollment-date").val();
    if(name==''){
        $("#full-name").focus();
        return;
    }if(cls==''){
        $("#class").focus();
        return;
    }if(dob==''){
        $("#birth-date").focus();
        return;
    }if(addr==''){
        $("#address").focus();
        return;
    }if(doe==''){
        $("#enrollment-date").focus();
        return;
    }
    var obj = {
        Roll_No: roll,
        Full_Name: name,
        Class: cls,
        Birth_Date: dob,
        Address: addr,
        Enrollment_Date: doe
    };
    var jsonobj = JSON.stringify(obj);
    var req=createSETRequest(token,jsonobj,dbname,relation,'UPDATE','Roll_No');
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml/set");
    jQuery.ajaxSetup({ async: true });
    disableAll();
}
