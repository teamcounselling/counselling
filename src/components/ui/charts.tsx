import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// Line Chart Component
interface LineChartProps {
  data: Array<Record<string, string | number>>;
  xField: string;
  yFields: string[];
  colors?: string[];
  height?: string;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yFields,
  colors = ['#0ea5e9', '#7c3aed', '#f59e0b'],
  height = '400px',
  title
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Dispose previous chart
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    try {
      // Create root element
      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout
        })
      );

      // Add title
      if (title) {
        chart.children.unshift(
          am5.Label.new(root, {
            text: title,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            x: am5.p50,
            centerX: am5.p50,
            paddingTop: 10,
            paddingBottom: 10
          })
        );
      }

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: xField,
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Add series
      yFields.forEach((field, index) => {
        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: field,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: field,
            categoryXField: xField,
            tooltip: am5.Tooltip.new(root, {
              labelText: '{name}: {valueY}'
            })
          })
        );

        series.strokes.template.setAll({
          strokeWidth: 3,
          stroke: am5.color(colors[index % colors.length])
        });

        series.bullets.push(() => {
            return am5.Bullet.new(root, {
              sprite: am5.Circle.new(root, {
                radius: 4,
                fill: am5.color(colors[index % colors.length])
              })
            });
          });

          series.data.setAll(data); // <-- Add this
      });

      // Set data
      xAxis.data.setAll(data);
      root._logo?.dispose()
    } catch (error) {
      console.error('Error creating LineChart:', error);
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
      }
    }

    // Cleanup
    return () => {
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, xField, yFields, colors, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

// Bar Chart Component
interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xField: string;
  yFields: string[];
  colors?: string[];
  height?: string;
  title?: string;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  yFields,
  colors = ['#0ea5e9', '#7c3aed', '#f59e0b'],
  height = '400px',
  title,
  stacked = false
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Dispose previous chart
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    try {
      // Create root element
      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout
        })
      );

      // Add title
      if (title) {
        chart.children.unshift(
          am5.Label.new(root, {
            text: title,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            x: am5.p50,
            centerX: am5.p50,
            paddingTop: 10,
            paddingBottom: 10
          })
        );
      }

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: xField,
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Add series
      yFields.forEach((field, index) => {
        const series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: field,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: field,
            categoryXField: xField,
            stacked: stacked,
            tooltip: am5.Tooltip.new(root, {
              labelText: '{name}: {valueY}'
            })
          })
        );

        series.columns.template.setAll({
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0,
          cornerRadiusTL: 5,
          cornerRadiusTR: 5,
          fillOpacity: 0.8,
          fill: am5.color(colors[index % colors.length])
        });

        series.columns.template.adapters.add('fill', () => {
          return am5.color(colors[index % colors.length]);
        });

        series.data.setAll(data);

      });

      // Set data
      xAxis.data.setAll(data);
      root._logo?.dispose()
    } catch (error) {
      console.error('Error creating BarChart:', error);
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
      }
    }

    // Cleanup
    return () => {
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, xField, yFields, colors, title, stacked]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

// Pie Chart Component
interface PieChartProps {
  data: Array<Record<string, string | number>>;
  valueField: string;
  categoryField: string;
  colors?: string[];
  height?: string;
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  valueField,
  categoryField,
  colors = ['#0ea5e9', '#7c3aed', '#f59e0b', '#ef4444', '#059669'],
  height = '400px',
  title
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Dispose previous chart
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    try {
      // Create root element
      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout
        })
      );

      // Add title
      if (title) {
        chart.children.unshift(
          am5.Label.new(root, {
            text: title,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            x: am5.p50,
            centerX: am5.p50,
            paddingTop: 10,
            paddingBottom: 10
          })
        );
      }

      // Create series
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: 'Series',
          categoryField: categoryField,
          valueField: valueField,
          legendLabelText: '{name}',
          legendValueText: '{valuePercentTotal.formatNumber(\'#.#\')}%'
        })
      );

      series.labels.template.setAll({
        textType: 'adjusted',
        centerX: am5.p50,
        centerY: am5.p50,
        text: '{valuePercentTotal.formatNumber(\'#.#\')}%'
      });

      series.slices.template.setAll({
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        tooltipText: '{name}: {value} ({valuePercentTotal.formatNumber(\'#.#\')}%)'
      });

      // Set colors
      series.set('colors', am5.ColorSet.new(root, {
        colors: colors.map(color => am5.color(color))
      }));

      // Set data
      series.data.setAll(data);

      // Add legend
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          centerY: am5.p100,
          y: am5.p100,
          layout: root.horizontalLayout
        })
      );
      root._logo?.dispose()
      legend.data.setAll(series.dataItems);

    } catch (error) {
      console.error('Error creating PieChart:', error);
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
      }
    }

    // Cleanup
    return () => {
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, valueField, categoryField, colors, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

// Area Chart Component
interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  xField: string;
  yFields: string[];
  colors?: string[];
  height?: string;
  title?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xField,
  yFields,
  colors = ['#0ea5e9', '#7c3aed', '#f59e0b'],
  height = '400px',
  title
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Dispose previous chart
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    try {
      // Create root element
      const root = am5.Root.new(chartRef.current);
      rootRef.current = root;
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout
        })
      );

      // Add title
      if (title) {
        chart.children.unshift(
          am5.Label.new(root, {
            text: title,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            x: am5.p50,
            centerX: am5.p50,
            paddingTop: 10,
            paddingBottom: 10
          })
        );
      }

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: xField,
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Add series
      yFields.forEach((field, index) => {
        const series = chart.series.push(
          am5xy.StepLineSeries.new(root, {
            name: field,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: field,
            categoryXField: xField,
            tooltip: am5.Tooltip.new(root, {
              labelText: '{name}: {valueY}'
            }),
            fill: am5.color(colors[index % colors.length])
          })
        );

        series.strokes.template.setAll({
          strokeWidth: 3,
          stroke: am5.color(colors[index % colors.length])
        });
      });

      // Set data
      xAxis.data.setAll(data);
      root._logo?.dispose()

    } catch (error) {
      console.error('Error creating AreaChart:', error);
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
      }
    }

    // Cleanup
    return () => {
      if (rootRef.current && !rootRef.current.isDisposed()) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [data, xField, yFields, colors, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};
