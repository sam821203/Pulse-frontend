import { type Ref } from 'vue'
import * as d3 from 'd3'
import type { ParsedChartPoint } from '../utils/chartTime'
import { formatIntradayTooltip } from '../utils/chartTime'
import { computeTaiwanLimitPrices } from '../utils/limitPrice'
import { getIntradayTimeDomain } from '../utils/marketHours'

const DEFAULT_MARGIN = { top: 8, right: 88, bottom: 28, left: 56 }
const PANEL_GAP = 6
const VOLUME_PANEL_RATIO = 0.26
const COLOR_UP = '#eb3d4d'
const COLOR_DOWN = '#00b74a'
const COLOR_REF = '#9CA3AF'
const COLOR_GRID = '#E5E7EB'
const X_TICK_LABELS = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30']

export interface UseIntradayCrosshairChartOptions {
  containerRef: Ref<HTMLElement | null>
  series: Ref<ParsedChartPoint[]>
  previousClose: Ref<number>
}

function interpolateAtPrice(
  a: ParsedChartPoint,
  b: ParsedChartPoint,
  targetPrice: number
): ParsedChartPoint {
  const span = b.close - a.close
  const t = span === 0 ? 0 : (targetPrice - a.close) / span
  const timeMs = a.time.getTime() + t * (b.time.getTime() - a.time.getTime())
  return {
    ...a,
    time: new Date(timeMs),
    close: targetPrice,
    open: targetPrice,
    high: targetPrice,
    low: targetPrice
  }
}

function splitSeriesAtReference(
  points: ParsedChartPoint[],
  ref: number
): { above: ParsedChartPoint[][]; below: ParsedChartPoint[][] } {
  const above: ParsedChartPoint[][] = []
  const below: ParsedChartPoint[][] = []
  let aboveSeg: ParsedChartPoint[] = []
  let belowSeg: ParsedChartPoint[] = []

  const pushAbove = (p: ParsedChartPoint) => {
    aboveSeg.push(p)
  }
  const pushBelow = (p: ParsedChartPoint) => {
    belowSeg.push(p)
  }
  const flushAbove = () => {
    if (aboveSeg.length) above.push(aboveSeg)
    aboveSeg = []
  }
  const flushBelow = () => {
    if (belowSeg.length) below.push(belowSeg)
    belowSeg = []
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const isAbove = p.close >= ref

    if (i === 0) {
      if (isAbove) pushAbove(p)
      else pushBelow(p)
      continue
    }

    const prev = points[i - 1]
    const prevAbove = prev.close >= ref

    if (prevAbove !== isAbove) {
      const cross = interpolateAtPrice(prev, p, ref)
      if (prevAbove) {
        pushAbove(cross)
        flushAbove()
        pushBelow(cross)
        pushBelow(p)
      } else {
        pushBelow(cross)
        flushBelow()
        pushAbove(cross)
        pushAbove(p)
      }
    } else if (isAbove) {
      pushAbove(p)
    } else {
      pushBelow(p)
    }
  }

  flushAbove()
  flushBelow()
  return { above, below }
}

function volumeBarColor(
  point: ParsedChartPoint,
  index: number,
  points: ParsedChartPoint[],
  ref: number
): string {
  const prevClose = index > 0 ? points[index - 1].close : ref
  return point.close >= prevClose ? COLOR_UP : COLOR_DOWN
}

export function useIntradayCrosshairChart(options: UseIntradayCrosshairChartOptions) {
  const { containerRef, series, previousClose } = options
  const chartId = `intraday-${Math.random().toString(36).slice(2, 9)}`

  let width = 0
  let height = 0
  let margin = { ...DEFAULT_MARGIN }
  let innerWidth = 0
  let priceInnerHeight = 0
  let volumeInnerHeight = 0
  let totalPlotHeight = 0

  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  let plotGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let priceGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let volumeGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let priceYAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let volumeYAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let gridGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let areaAbovePath: d3.Selection<SVGPathElement, unknown, null, undefined>
  let areaBelowPath: d3.Selection<SVGPathElement, unknown, null, undefined>
  let lineAboveGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let lineBelowGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let referenceLine: d3.Selection<SVGLineElement, unknown, null, undefined>
  let limitUpLine: d3.Selection<SVGLineElement, unknown, null, undefined>
  let limitDownLine: d3.Selection<SVGLineElement, unknown, null, undefined>
  let limitUpLabel: d3.Selection<SVGTextElement, unknown, null, undefined>
  let limitDownLabel: d3.Selection<SVGTextElement, unknown, null, undefined>
  let volumeBarsGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  let crosshairX: d3.Selection<SVGLineElement, unknown, null, undefined>
  let crosshairY: d3.Selection<SVGLineElement, unknown, null, undefined>
  let crosshairPoint: d3.Selection<SVGCircleElement, unknown, null, undefined>
  let overlayRect: d3.Selection<SVGRectElement, unknown, null, undefined>
  let tooltipEl: HTMLDivElement | null = null

  const xScale = d3.scaleTime()
  const yPriceScale = d3.scaleLinear()
  const yVolumeScale = d3.scaleLinear()

  let bisectSeries: { time: number; point: ParsedChartPoint }[] = []
  let barWidth = 3
  let initialized = false

  const measure = () => {
    const el = containerRef.value
    if (!el) return false
    width = el.clientWidth
    margin = {
      ...DEFAULT_MARGIN,
      left: width < 640 ? 48 : DEFAULT_MARGIN.left,
      right: width < 640 ? 72 : DEFAULT_MARGIN.right
    }
    height = Math.max(260, Math.min(width * 0.58, 520))
    innerWidth = width - margin.left - margin.right
    const innerTotal = height - margin.top - margin.bottom
    volumeInnerHeight = Math.round(innerTotal * VOLUME_PANEL_RATIO)
    priceInnerHeight = innerTotal - volumeInnerHeight - PANEL_GAP
    totalPlotHeight = priceInnerHeight + PANEL_GAP + volumeInnerHeight
    return width > 0 && innerWidth > 0 && priceInnerHeight > 0 && volumeInnerHeight > 0
  }

  const getXDomain = (points: ParsedChartPoint[]): [Date, Date] => {
    const ref = points[0]?.time ?? new Date()
    return getIntradayTimeDomain(ref)
  }

  const getYDomain = (
    points: ParsedChartPoint[],
    ref: number,
    limits: { upLimit: number; downLimit: number }
  ): [number, number] => {
    const closes = points.map((p) => p.close)
    const dataMin = closes.length ? Math.min(...closes) : ref
    const dataMax = closes.length ? Math.max(...closes) : ref
    const min = Math.min(dataMin, limits.downLimit, ref)
    const max = Math.max(dataMax, limits.upLimit, ref)
    const pad = Math.max((max - min) * 0.03, 0.1)
    return [min - pad, max + pad]
  }

  const hideTooltip = () => {
    if (!tooltipEl) return
    tooltipEl.style.opacity = '0'
    tooltipEl.style.pointerEvents = 'none'
  }

  const showTooltip = (x: number, y: number, text: string) => {
    if (!tooltipEl || !containerRef.value) return
    const pad = 12
    const maxLeft = width - tooltipEl.offsetWidth - pad
    const maxTop = height - tooltipEl.offsetHeight - pad
    tooltipEl.textContent = text
    tooltipEl.style.opacity = '1'
    tooltipEl.style.left = `${Math.min(Math.max(pad, x + 14), maxLeft)}px`
    tooltipEl.style.top = `${Math.min(Math.max(pad, y - 36), maxTop)}px`
  }

  const init = () => {
    const el = containerRef.value
    if (!el || initialized) return
    if (!measure()) return

    d3.select(el).selectAll('*').remove()
    el.classList.add('intraday-chart-host')

    tooltipEl = document.createElement('div')
    tooltipEl.className =
      'intraday-chart-tooltip pointer-events-none absolute z-10 rounded px-2 py-1 text-xs text-gray-800 bg-white/95 border border-gray-200 shadow-sm whitespace-nowrap opacity-0 transition-opacity'
    el.appendChild(tooltipEl)

    svg = d3
      .select(el)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'block')

    const defs = svg.append('defs')

    const gradientAbove = defs
      .append('linearGradient')
      .attr('id', `${chartId}-gradientAbove`)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')
    gradientAbove.append('stop').attr('offset', '0%').attr('stop-color', COLOR_UP).attr('stop-opacity', 0.35)
    gradientAbove.append('stop').attr('offset', '100%').attr('stop-color', COLOR_UP).attr('stop-opacity', 0)

    const gradientBelow = defs
      .append('linearGradient')
      .attr('id', `${chartId}-gradientBelow`)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')
    gradientBelow.append('stop').attr('offset', '0%').attr('stop-color', COLOR_DOWN).attr('stop-opacity', 0)
    gradientBelow.append('stop').attr('offset', '100%').attr('stop-color', COLOR_DOWN).attr('stop-opacity', 0.35)

    plotGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    gridGroup = plotGroup.append('g').attr('class', 'grid')

    priceGroup = plotGroup.append('g').attr('class', 'price-panel')
    volumeGroup = plotGroup
      .append('g')
      .attr('class', 'volume-panel')
      .attr('transform', `translate(0,${priceInnerHeight + PANEL_GAP})`)

    areaAbovePath = priceGroup
      .append('path')
      .attr('class', 'area-above')
      .attr('fill', `url(#${chartId}-gradientAbove)`)

    areaBelowPath = priceGroup
      .append('path')
      .attr('class', 'area-below')
      .attr('fill', `url(#${chartId}-gradientBelow)`)

    lineAboveGroup = priceGroup.append('g').attr('class', 'line-above')
    lineBelowGroup = priceGroup.append('g').attr('class', 'line-below')

    limitUpLine = priceGroup
      .append('line')
      .attr('class', 'limit-up-line')
      .attr('stroke', COLOR_UP)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.85)

    limitDownLine = priceGroup
      .append('line')
      .attr('class', 'limit-down-line')
      .attr('stroke', COLOR_DOWN)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.85)

    referenceLine = priceGroup
      .append('line')
      .attr('class', 'reference-line')
      .attr('stroke', COLOR_REF)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    limitUpLabel = priceGroup
      .append('text')
      .attr('class', 'limit-up-label')
      .attr('fill', COLOR_UP)
      .attr('font-size', 12)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')

    limitDownLabel = priceGroup
      .append('text')
      .attr('class', 'limit-down-label')
      .attr('fill', COLOR_DOWN)
      .attr('font-size', 12)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')

    priceYAxisGroup = priceGroup.append('g').attr('class', 'y-axis-price')
    volumeBarsGroup = volumeGroup.append('g').attr('class', 'volume-bars')
    volumeYAxisGroup = volumeGroup.append('g').attr('class', 'y-axis-volume')

    xAxisGroup = plotGroup
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${totalPlotHeight})`)

    crosshairX = plotGroup
      .append('line')
      .attr('class', 'crosshair-x')
      .style('display', 'none')
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')

    crosshairY = priceGroup
      .append('line')
      .attr('class', 'crosshair-y')
      .style('display', 'none')
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')

    crosshairPoint = priceGroup
      .append('circle')
      .attr('class', 'crosshair-point')
      .attr('r', 4)
      .style('display', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    overlayRect = plotGroup
      .append('rect')
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all')
      .style('cursor', 'crosshair')

    const bisectTime = d3.bisector<{ time: number }, number>((d) => d.time).left

    overlayRect
      .on('mouseover', () => {
        crosshairX.style('display', null)
        crosshairY.style('display', null)
        crosshairPoint.style('display', null)
      })
      .on('mouseout', () => {
        crosshairX.style('display', 'none')
        crosshairY.style('display', 'none')
        crosshairPoint.style('display', 'none')
        hideTooltip()
      })
      .on('mousemove', (event) => {
        const points = series.value
        if (!points.length || !bisectSeries.length) return

        const [mx, my] = d3.pointer(event)
        const hoveredTime = xScale.invert(mx).getTime()
        const idx = bisectTime(bisectSeries, hoveredTime)
        let bestIdx = Math.min(Math.max(idx, 0), bisectSeries.length - 1)
        if (idx > 0) {
          const prev = bisectSeries[idx - 1]
          const curr = bisectSeries[bestIdx]
          if (Math.abs(hoveredTime - prev.time) <= Math.abs(hoveredTime - curr.time)) {
            bestIdx = idx - 1
          }
        }
        const point = bisectSeries[bestIdx].point
        const ref = previousClose.value

        const x = xScale(point.time)
        const y = yPriceScale(point.close)

        crosshairX.attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', totalPlotHeight)
        crosshairY.attr('x1', 0).attr('x2', innerWidth).attr('y1', y).attr('y2', y)
        crosshairPoint
          .attr('cx', x)
          .attr('cy', y)
          .attr('fill', point.close >= ref ? COLOR_UP : COLOR_DOWN)

        const containerRect = containerRef.value?.getBoundingClientRect()
        const eventX = containerRect ? event.clientX - containerRect.left : mx + margin.left
        const eventY = containerRect ? event.clientY - containerRect.top : my + margin.top
        showTooltip(eventX, eventY, formatIntradayTooltip(point))
      })

    initialized = true
  }

  const resize = () => {
    if (!measure() || !initialized) return

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)
    plotGroup.attr('transform', `translate(${margin.left},${margin.top})`)
    volumeGroup.attr('transform', `translate(0,${priceInnerHeight + PANEL_GAP})`)
    xAxisGroup.attr('transform', `translate(0,${totalPlotHeight})`)
    overlayRect.attr('width', innerWidth).attr('height', totalPlotHeight)
  }

  const drawGrid = () => {
    gridGroup.selectAll('*').remove()

    const yTicks = yPriceScale.ticks(5)
    gridGroup
      .selectAll('.grid-h')
      .data(yTicks)
      .join('line')
      .attr('class', 'grid-h')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yPriceScale(d))
      .attr('y2', (d) => yPriceScale(d))
      .attr('stroke', COLOR_GRID)
      .attr('stroke-width', 1)

    const xTicks = xScale.ticks(6)
    gridGroup
      .selectAll('.grid-v')
      .data(xTicks)
      .join('line')
      .attr('class', 'grid-v')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', totalPlotHeight)
      .attr('stroke', COLOR_GRID)
      .attr('stroke-width', 1)
      .attr('opacity', 0.65)
  }

  const update = () => {
    const points = series.value
    const ref = previousClose.value
    if (!initialized) {
      if (!measure()) return
      init()
      resize()
    }
    if (!initialized || !points.length || ref <= 0) {
      areaAbovePath?.attr('d', null)
      areaBelowPath?.attr('d', null)
      lineAboveGroup?.selectAll('path').remove()
      lineBelowGroup?.selectAll('path').remove()
      referenceLine?.style('display', 'none')
      limitUpLine?.style('display', 'none')
      limitDownLine?.style('display', 'none')
      limitUpLabel?.style('display', 'none')
      limitDownLabel?.style('display', 'none')
      volumeBarsGroup?.selectAll('rect').remove()
      return
    }

    resize()

    const limits = computeTaiwanLimitPrices(ref)
    const xDomain = getXDomain(points)
    xScale.domain(xDomain).range([0, innerWidth])
    yPriceScale.domain(getYDomain(points, ref, limits)).range([priceInnerHeight, 0]).nice()
    yVolumeScale
      .domain([0, d3.max(points, (d) => d.volume) || 1])
      .range([volumeInnerHeight, 0])
      .nice()

    bisectSeries = points.map((p) => ({ time: p.time.getTime(), point: p }))
    barWidth = Math.max(2, Math.min(6, (innerWidth / Math.max(points.length, 1)) * 0.55))

    const areaAbove = d3
      .area<ParsedChartPoint>()
      .x((d) => xScale(d.time))
      .y0(() => yPriceScale(ref))
      .y1((d) => yPriceScale(Math.max(d.close, ref)))

    const areaBelow = d3
      .area<ParsedChartPoint>()
      .x((d) => xScale(d.time))
      .y0(() => yPriceScale(ref))
      .y1((d) => yPriceScale(Math.min(d.close, ref)))

    const line = d3
      .line<ParsedChartPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yPriceScale(d.close))

    areaAbovePath.datum(points).attr('d', areaAbove)
    areaBelowPath.datum(points).attr('d', areaBelow)

    const { above, below } = splitSeriesAtReference(points, ref)
    lineAboveGroup
      .selectAll<SVGPathElement, ParsedChartPoint[]>('path')
      .data(above)
      .join('path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', COLOR_UP)
      .attr('stroke-width', 1.75)
    lineBelowGroup
      .selectAll<SVGPathElement, ParsedChartPoint[]>('path')
      .data(below)
      .join('path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', COLOR_DOWN)
      .attr('stroke-width', 1.75)

    referenceLine
      .style('display', null)
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yPriceScale(ref))
      .attr('y2', yPriceScale(ref))

    limitUpLine
      .style('display', null)
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yPriceScale(limits.upLimit))
      .attr('y2', yPriceScale(limits.upLimit))

    limitDownLine
      .style('display', null)
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yPriceScale(limits.downLimit))
      .attr('y2', yPriceScale(limits.downLimit))

    const labelX = innerWidth + 6
    limitUpLabel
      .style('display', null)
      .attr('x', labelX)
      .attr('y', yPriceScale(limits.upLimit))
      .text(`漲停 ${limits.upLimit.toFixed(1)}`)

    limitDownLabel
      .style('display', null)
      .attr('x', labelX)
      .attr('y', yPriceScale(limits.downLimit))
      .text(`跌停 ${limits.downLimit.toFixed(1)}`)

    volumeBarsGroup
      .selectAll<SVGRectElement, ParsedChartPoint>('rect')
      .data(points, (d) => d.time.getTime())
      .join('rect')
      .attr('x', (d) => xScale(d.time) - barWidth / 2)
      .attr('y', (d) => yVolumeScale(d.volume))
      .attr('width', barWidth)
      .attr('height', (d) => Math.max(0, volumeInnerHeight - yVolumeScale(d.volume)))
      .attr('fill', (d, i) => volumeBarColor(d, i, points, ref))

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((_d, i) => X_TICK_LABELS[i] ?? '')
    const priceYAxis = d3.axisLeft(yPriceScale).ticks(5).tickSize(0).tickPadding(6)
    const volumeYAxis = d3
      .axisLeft(yVolumeScale)
      .ticks(2)
      .tickSize(0)
      .tickPadding(6)
      .tickFormat((d) => (Number(d) >= 1000 ? `${Math.round(Number(d) / 1000)}k` : String(d)))

    xAxisGroup.call(xAxis)
    priceYAxisGroup.call(priceYAxis)
    volumeYAxisGroup.call(volumeYAxis)

    xAxisGroup.selectAll('text').attr('font-size', 12).attr('fill', '#6B7280')
    priceYAxisGroup.selectAll('text').attr('font-size', 12).attr('fill', '#6B7280')
    volumeYAxisGroup.selectAll('text').attr('font-size', 11).attr('fill', '#9CA3AF')
    xAxisGroup.select('.domain').remove()
    priceYAxisGroup.select('.domain').remove()
    volumeYAxisGroup.select('.domain').remove()

    drawGrid()
  }

  const destroy = () => {
    if (containerRef.value) {
      containerRef.value.classList.remove('intraday-chart-host')
      d3.select(containerRef.value).selectAll('*').remove()
    }
    tooltipEl = null
    initialized = false
    bisectSeries = []
  }

  return { init, resize, update, destroy }
}
