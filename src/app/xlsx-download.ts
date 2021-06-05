

export class XlsxDownload {
    static async ExportCustos(data){
        var excel = require("exceljs");
        var workbook1 = new excel.Workbook();
        workbook1.creator = 'Me';
        workbook1.lastModifiedBy = 'Me';
        workbook1.created = new Date();
        workbook1.modified = new Date();
        console.log(data)
        var sheet1 = workbook1.addWorksheet('Sheet1');
        var reColumns=[
            {header:'Unidade',          key:'un'},
            {header:'Classe Tarifária', key:'ct'},
        ];
        sheet1.columns = reColumns;
        for(let obj of data){
            sheet1.addRow(obj)
        }
        workbook1.xlsx.writeBuffer("error.xlsx").then(function(binaryData) {
            var filename = "aa.xlsx" 
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob([binaryData], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

}
