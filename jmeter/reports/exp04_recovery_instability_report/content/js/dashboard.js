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

    var data = {"OkPercent": 42.857142857142854, "KoPercent": 57.142857142857146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07142857142857142, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "recovery_process_one"], "isController": false}, {"data": [0.0, 500, 1500, "enqueue_backlog"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35, 20, 57.142857142857146, 743.1142857142858, 3, 2477, 11.0, 2208.7999999999997, 2354.5999999999995, 2477.0, 1.3273161667109106, 0.37264105104478745, 0.2820176509348098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["recovery_process_one", 15, 0, 0.0, 1709.7333333333333, 1007, 2477, 1903.0, 2385.2000000000003, 2477.0, 2477.0, 0.5844079947013675, 0.18608981133361904, 0.12840995977324968], "isController": false}, {"data": ["enqueue_backlog", 20, 20, 100.0, 18.15, 3, 164, 7.0, 78.50000000000016, 160.09999999999994, 164.0, 28.65329512893983, 7.234677202722064, 5.932127507163324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 9,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6210&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 4,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-2997&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 3,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-5507&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 19,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3620&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 11,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-9705&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 14,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3660&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 18,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-7798&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 1,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6875&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 17,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-1668&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 5,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6902&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 16,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3883&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 7,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-8636&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 2,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-5861&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 10,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3709&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 13,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-1953&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 8,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-2392&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 15,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6589&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 12,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3180&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 20,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6887&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}, {"data": ["Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 6,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-1980&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, 5.0, 2.857142857142857], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35, 20, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 9,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6210&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 4,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-2997&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 3,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-5507&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 19,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3620&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 11,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-9705&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["enqueue_backlog", 20, 20, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 9,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-6210&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 4,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-2997&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 3,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-5507&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                           ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 19,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-3620&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1, "Test failed: text expected to equal /\\n\\n****** received  : [[[{\\n  &quot;queue_depth&quot;: 11,\\n  &quot;status&quot;: &quot;ok&quot;,\\n  &quot;type&quot;: &quot;work_enqueued&quot;,\\n  &quot;work_id&quot;: &quot;WORK-9705&quot;\\n}\\n]]]\\n\\n****** comparison: [[[200                                                                                            ]]]\\n\\n/", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
