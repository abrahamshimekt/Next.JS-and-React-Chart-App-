import Papa from "papaparse";
import axios from "axios";
import readXlsxFile from "read-excel-file";

export function csvDataParser(csvFilePath, dateTimeKey) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const [seriesData, allSeriesNames, seriesMapData] = processCSVData(
          results.data,
          dateTimeKey
        );
        resolve([seriesData, allSeriesNames, seriesMapData]);
      },
      error: function (error) {
        console.error("Error fetching CSV data:", error);
        reject(error);
      },
    });
  });
}

export function processExcelData(dataUrl) {
  return fetch(dataUrl)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => readXlsxFile(blob))
    .then((rows) => {
      return convertXLSXDataToTimeSeries(rows);
    });
}

export function processCSVData(data, dateTimeKey) {
  if (!Array.isArray(data)) {
    throw new Error("Data is not an array");
  }

  const allSeriesNames = Object.keys(data[0]).filter(
    (key) => key !== dateTimeKey && key !== ""
  );

  let series = allSeriesNames.map((name) => ({
    name: name,
    data: [],
  }));

  let seriesMap = allSeriesNames.map((name) => ({
    name: name,
    data: {},
  }));

  data.forEach((row) => {
    const dateTime = new Date(row[dateTimeKey]).getTime();
    series.forEach((s) => {
      const value = parseFloat(row[s.name]);
      if (!isNaN(value) && !isNaN(dateTime)) {
        s.data.push([dateTime, value]);
      }
    });

    seriesMap.forEach((s) => {
      const value = parseFloat(row[s.name]);
      if (!isNaN(value) && !isNaN(dateTime)) {
        s.data[dateTime] = value;
      }
    });
  });


  return [series, allSeriesNames, seriesMap];
}

export function JsonParser(dataUrl) {
  return fetch(dataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const extractedSeriesNames = Object.keys(data[0]).filter(
        (key) => key !== "date"
      );

      const seriesData = extractedSeriesNames.map((key) => ({
        name: key,
        data: data
          .map((item) => [
            new Date(item.date).getTime(),
            item[key] !== "" ? parseFloat(item[key]) : null,
          ])
          .filter((point) => !isNaN(point[1])),
      }));
      const seriesMapData = extractedSeriesNames.map((key) => ({
        name: key,
        data: data.reduce((acc, item) => {
            const dateKey = new Date(item.date).getTime();
            const value = item[key] !== "" ? parseFloat(item[key]) : null;
            if (!isNaN(value)) {
                acc[dateKey] = value;
            }
            return acc;
        }, {})
    }));

      return [seriesData, extractedSeriesNames, seriesMapData];
    })
    .catch((error) => {
      console.error("Error fetching JSON:", error);
      throw error; // Propagate the error to the caller
    });
}

function excelDateToTimestamp(excelDate) {
  // Excel date to JS date
  const date = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  // JS date to Unix timestamp
  return date.getTime();
}

export async function convertXLSXDataToTimeSeries(rows) {
  try {
    const headers = rows[0];
    rows.shift();
    const timeSeriesData = {};
    const timeSeriesMapData = {};
    const seriesNames = headers.slice(1, headers.length - 1);

    rows.forEach((item) => {
      const timestamp = item[0].getTime();
      for (let i = 1; i < headers.length - 1; i++) {
        if (!timeSeriesData[headers[i]]) {
          timeSeriesData[headers[i]] = [];
        }
        
        timeSeriesData[headers[i]].push([timestamp, item[i]]);

        if (!timeSeriesMapData[headers[i]]) {
          timeSeriesMapData[headers[i]] = {};
        }
        
        timeSeriesMapData[headers[i]][timestamp] = item[i];
      }
    });
    
  
    // Convert the object into an array of series objects for Highcharts
    const series = seriesNames.map((name) => {
      return { name: name, data: timeSeriesData[name] };
    });

    const seriesMap = seriesNames.map((name) => {
      return { name: name, data: timeSeriesMapData[name] };    
    });

    const sortedData = series.map((series) => ({
      ...series,
      data: series.data.sort((a, b) => a[0] - b[0]), // Sort by the first element (timestamp)
    }));

    return [sortedData, seriesNames, seriesMap];
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [[], []];
  }
}

export async function convertExcelDataToTimeSeries(excelDataUrl) {
  try {
    const response = await axios.get(excelDataUrl);
    const timeSeriesData = {};
    const timeSeriesMapData = {};
    const seriesNames = [];

    response.data.forEach((item) => {
      const timestamp = excelDateToTimestamp(item.Date);
      const filter = "Flow US$ mill" + "(" + item.Filters + ")";
      const flow = item["Flow US$ mill"];

      // Initialize the series array for each filter if not already done
      if (!timeSeriesData[filter]) {
        timeSeriesData[filter] = [];
        timeSeriesMapData[filter] = {};
        seriesNames.push(filter);
      }

      // Append the data point to the appropriate series
      timeSeriesData[filter].push([timestamp, flow]);
      timeSeriesMapData[filter][timestamp] = flow;
    });

    // Convert the object into an array of series objects for Highcharts
    const series = seriesNames.map((name) => {
      return { name: name, data: timeSeriesData[name] };
    });

    const seriesMap = seriesNames.map((name) => {
      return { name: name, data: timeSeriesMapData[name] };
    });

    const sortedData = series.map((series) => ({
      ...series,
      data: series.data.sort((a, b) => a[0] - b[0]), // Sort by the first element (timestamp)
    }));

    return [sortedData, seriesNames, seriesMap];
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [[], []];
  }
}


//  data Map not added to below functions

export async function convertChinaEqExcelDataToTimeSeries(excelDataUrl) {
  try {
    const response = await axios.get(excelDataUrl);
    const timeSeriesData = {};
    const domesticFilter = "Domestic Domicile(s)";
    const foreignFilter = "Foreign Domiciles";
    const seriesNames = [];
    seriesNames.push(domesticFilter);
    seriesNames.push(foreignFilter);
    timeSeriesData[domesticFilter] = [];
    timeSeriesData[foreignFilter] = [];

    response.data.forEach((item) => {
      const timestamp = excelDateToTimestamp(item.Date);
      const domesticFlow = item[" Domestic Domicile(s) "];
      const foreignFlow = item[" Foreign Domiciles "];

      // Append the data point to the appropriate series
      timeSeriesData[domesticFilter].push([timestamp, domesticFlow]);
      timeSeriesData[foreignFilter].push([timestamp, foreignFlow]);
    });

    // Convert the object into an array of series objects for Highcharts
    const series = seriesNames.map((name) => {
      return { name: name, data: timeSeriesData[name] };
    });

    const sortedData = series.map((series) => ({
      ...series,
      data: series.data.sort((a, b) => a[0] - b[0]), // Sort by the first element (timestamp)
    }));

    return [sortedData, seriesNames];
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [[], []];
  }
}

export async function convertPCEExcelDataToTimeSeries(excelDataUrl) {
  try {
    const response = await axios.get(excelDataUrl);
    const timeSeriesData = {};
    const seriesNames = [];
    const headers = response.data[0];
    response.data.shift();
    response.data.forEach((item, index) => {
      const title = item[0]
      if (title) {
        timeSeriesData[title] = [];
        seriesNames.push(title);
        for (let i = 5; i < item.length; i++) {
          const timeStamp = excelDateToTimestamp(headers[i]);
          timeSeriesData[title].push([timeStamp, item[i]])
        }
      }   
    });

    // Convert the object into an array of series objects for Highcharts
    const series = seriesNames.map(name => {
      return { name: name, data: timeSeriesData[name] };
    });

    const sortedData = series.map(series => ({
      ...series,
      data: series.data.sort((a, b) => a[0] - b[0]) // Sort by the first element (timestamp)
    }));
  

    return [sortedData, seriesNames];
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [[], []];
  }
}

export function hashStringToId(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return -(( hash >>> 0)%10000 ); // Convert to positive integer (remove sign bit)
}