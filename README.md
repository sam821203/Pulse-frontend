# Pulse

A real-time stock tracking and analysis platform built with Vue3. It provides real-time stock tracking, financial data analysis, technical charts, and a visual interface, allowing users to easily view the latest stock dynamics and financial indicators. The backend is built with Nest.js and MongoDB, integrating [臺灣證券交易所 OpenAPI](https://openapi.twse.com.tw/), [證券櫃檯買賣中心 OpenAPI](https://www.tpex.org.tw/openapi/), Taiwan OTC Exchange OpenAPI, and Taiwan Stock Exchange for real-time stock data and financial reports.

## Features

**Real-Time Stock Tracking:** Allows users to track the real-time price movements and historical trends of specific stocks.

**Financial Data Analysis:** Displays the company's financial reports and analyzes key financial indicators.

**Technical Charts:** Presents technical indicators of stocks using charts to assist investment decisions.

## Technology Stack

**Frontend:** Vue3, Vue Router, Pinia, Axios, RxJS

**Backend:** Nest.js, MongoDB

**Data Visualization:** D3.js

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
