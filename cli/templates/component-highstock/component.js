import highstock from "highstock";

import ComponentFactory from "ct-component/ComponentFactory";
import SeriesListener from "ct-chart/series/SeriesListener";
import SeriesRequest from "ct-chart/series/SeriesRequest";
import Series from "ct-chart/Series";

export default class {{componentName}} {
  constructor() {
    this.request = new SeriesRequest({
      instrument: "/YOUR/SUBJECT",
      interval: "10s",
      type: SeriesRequest.REQUEST_BOTH,
      intraperiod: true
    });

    this.series = new Series(this.request);
    this.series.addListener(this);
    this.elem = document.createElement("div");
  }

  /*
    ct-component/Component interface
  */
  getElement() {
    return this.elem;
  }

  onOpen(width, height) {
    this.width = width;
    this.height = height;
    this.elem.parentNode.style.overflow = "hidden";
  }

  onResize(width, height) {
    this.chart.setSize(width, height);
  }

  setFrame(frame) {
    this.frame = frame;
  }

  /*
    ct-chart/series/SeriesListener interface
  */
  onSeriesError(subject, error) {
    console.error(subject, error);
  }

  onSeriesStatusUpdate(subject, status) {
    if (status !== "STATUS_OK") console.log(subject, status);
  }

  onSeriesData(id, dataUpdate, reset) {
    if (reset) {
      this.data = dataUpdate;
    }

    if (!this.chart) {
      this.data = dataUpdate;
      this.chart = new highstock.StockChart(this.getChartConfig(dataUpdate));
    } else {
      if (this.lastPointMatches(dataUpdate, this.data)) {
        this.data[this.data.length - 1] = dataUpdate[0];
      } else {
        this.data = this.data.concat(dataUpdate);
      }

      this.chart.series[0].setData(this.data);
    }
  }

  /*
    Utils
  */
  lastPointMatches(data1, data2) {
    return data1[0][0] === data2[data2.length - 1][0];
  }

  getChartConfig(initialData) {
    return {
      chart: {
        renderTo: this.elem,
        width: this.width,
        height: this.height
      },
      series: [
        {
          id: this.request.getId(),
          type: "candlestick",
          name: this.request.getDisplayName(),
          data: initialData
        }
      ],
      yAxis: {
        offset: 40
      }
    };
  }

  static createFromXml(sXML) {
    return new {{componentName}}();
  }
}

ComponentFactory.registerComponent("{{componentName}}", {{componentName}}.createFromXml);
