/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.16757741347905, "KoPercent": 7.832422586520948};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9019011406844106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "signinAccount"], "isController": false}, {"data": [1.0, 500, 1500, "ViewCategory"], "isController": true}, {"data": [0.022727272727272728, 500, 1500, "AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Home page"], "isController": true}, {"data": [1.0, 500, 1500, "signOff"], "isController": false}, {"data": [1.0, 500, 1500, "Login page"], "isController": true}, {"data": [1.0, 500, 1500, "addItemToCart"], "isController": false}, {"data": [1.0, 500, 1500, "ViewProduct"], "isController": true}, {"data": [1.0, 500, 1500, "setBillingInfo"], "isController": false}, {"data": [1.0, 500, 1500, "viewProduct"], "isController": false}, {"data": [0.0, 500, 1500, "confirmOrder"], "isController": false}, {"data": [1.0, 500, 1500, "signinForm"], "isController": false}, {"data": [1.0, 500, 1500, "newOrderForm"], "isController": false}, {"data": [1.0, 500, 1500, "viewCategory"], "isController": false}, {"data": [1.0, 500, 1500, "LogOff"], "isController": true}, {"data": [1.0, 500, 1500, "Signin"], "isController": true}, {"data": [1.0, 500, 1500, "viewCatalog"], "isController": false}, {"data": [1.0, 500, 1500, "homepage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1647, 129, 7.832422586520948, 43.443230115361324, 30, 308, 39.0, 55.0, 80.0, 87.0, 6.869226117239798, 2.755212460638542, 5.662999447375555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["signinAccount", 145, 0, 0.0, 38.56551724137931, 32, 102, 37.0, 43.0, 47.0, 91.87999999999982, 0.6111310138452785, 0.23812624465260365, 0.597404438338988], "isController": false}, {"data": ["ViewCategory", 145, 0, 0.0, 39.1448275862069, 0, 54, 39.0, 46.0, 47.69999999999999, 53.53999999999999, 0.6112366371024853, 0.2501920653053654, 0.4729097682991603], "isController": true}, {"data": ["AddToCart", 132, 129, 97.72727272727273, 161.5378787878788, 113, 226, 159.5, 175.0, 180.0, 222.69999999999987, 0.601333867852327, 0.9680252745294107, 2.1820774604577426], "isController": true}, {"data": ["Home page", 146, 0, 0.0, 83.23287671232879, 69, 308, 80.0, 87.0, 92.95000000000002, 241.26000000000016, 0.6126808142779808, 0.23873012196964294, 0.32907660923133736], "isController": true}, {"data": ["signOff", 126, 0, 0.0, 40.5396825396825, 34, 85, 39.0, 45.0, 46.0, 76.63000000000012, 0.59687917460137, 0.2372361563112867, 0.4727236431657334], "isController": false}, {"data": ["Login page", 146, 0, 0.0, 38.46575342465753, 32, 53, 37.0, 43.30000000000001, 46.650000000000006, 52.06, 0.6138374087652618, 0.24577474374390365, 0.47416542024738484], "isController": true}, {"data": ["addItemToCart", 136, 0, 0.0, 40.41176470588233, 35, 57, 39.0, 47.0, 50.150000000000006, 56.25999999999999, 0.6093763302102796, 0.2558904511625198, 0.5016643030930329], "isController": false}, {"data": ["ViewProduct", 142, 0, 0.0, 39.05633802816902, 0, 52, 39.0, 45.0, 47.849999999999994, 50.70999999999998, 0.6127450980392157, 0.251869047850214, 0.49260899823727905], "isController": true}, {"data": ["setBillingInfo", 132, 0, 0.0, 41.43181818181817, 34, 92, 40.0, 47.0, 49.349999999999994, 87.37999999999982, 0.6015558421553928, 0.23322038021063568, 0.7448953201689824], "isController": false}, {"data": ["viewProduct", 139, 0, 0.0, 39.89928057553956, 35, 52, 39.0, 45.0, 48.0, 50.79999999999998, 0.6082884775283358, 0.2554336380245941, 0.4995806734387992], "isController": false}, {"data": ["confirmOrder", 129, 129, 100.0, 39.98449612403099, 34, 55, 39.0, 45.0, 47.0, 54.69999999999999, 0.6013481386177384, 0.24723395152155064, 0.4698032332951081], "isController": false}, {"data": ["signinForm", 146, 0, 0.0, 38.46575342465753, 32, 53, 37.0, 43.30000000000001, 46.650000000000006, 52.06, 0.613839989573129, 0.24577577707517856, 0.4741674138206494], "isController": false}, {"data": ["newOrderForm", 134, 0, 0.0, 40.59701492537313, 34, 78, 39.0, 47.0, 51.0, 71.00000000000011, 0.6078696437158073, 0.2433853065658994, 0.48855148122862246], "isController": false}, {"data": ["viewCategory", 142, 0, 0.0, 39.97183098591549, 34, 54, 39.0, 46.0, 47.849999999999994, 53.56999999999999, 0.6126208524058312, 0.2560563719039997, 0.4839944039026537], "isController": false}, {"data": ["LogOff", 126, 0, 0.0, 79.07142857142856, 70, 125, 78.0, 85.3, 89.29999999999998, 119.60000000000008, 0.5967095729264342, 0.4696756990026426, 0.9376032254283523], "isController": true}, {"data": ["Signin", 146, 0, 0.0, 75.58904109589044, 37, 135, 74.0, 83.30000000000001, 91.65, 126.07000000000002, 0.6138528939379925, 0.47673537605847577, 1.0863181032471136], "isController": true}, {"data": ["viewCatalog", 272, 0, 0.0, 37.863970588235276, 30, 76, 36.0, 43.0, 45.0, 63.429999999999836, 1.1436115420676665, 0.4456064504736318, 0.9032021648734669], "isController": false}, {"data": ["homepage", 146, 0, 0.0, 83.22602739726027, 69, 308, 80.0, 87.0, 92.95000000000002, 241.26000000000016, 0.6130358290049924, 0.2388684529033125, 0.3292672909694784], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /Thank you, your order has been submitted\\\\./", 129, 100.0, 7.832422586520948], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1647, 129, "Test failed: text expected to contain /Thank you, your order has been submitted\\\\./", 129, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["confirmOrder", 129, 129, "Test failed: text expected to contain /Thank you, your order has been submitted\\\\./", 129, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
