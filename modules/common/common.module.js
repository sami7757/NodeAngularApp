(function () {
	'use strict';
	
	angular.module('common', []);
}());

function JSONToCSVConvertor(JSONData, ReportTitle, ShowHeader) {     
    
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';    
    //This condition will generate the Label/Header
    if (ShowHeader) {
        var header = "";
        var firstObj = JSONData[0];
        //This loop will extract the label from 1st index of on array
        for (var prop in firstObj) {
            //Now convert each value to string and comma-seprated
           if(firstObj[prop])
              header += prop + ',';
        }
        header = header.slice(0, -1);
        //append Label row with line break
        CSV += header + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }
    
    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //this trick will generate a temp "a" tag
    var link = document.createElement("a");    
    link.id="lnkDwnldLnk";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    
    var csv = CSV;  
    var blob = new Blob([csv], { type: 'text/csv' }); 
    var csvUrl = window.URL.createObjectURL(blob);
    var filename = 'SelectedUsers.csv';
    link.setAttribute("download", filename);
    link.setAttribute("href", csvUrl);
    link.click();
    //$('#lnkDwnldLnk')[0].click();    
    document.body.removeChild(link);
}