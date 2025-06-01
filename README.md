# Economy Chart Tool

A web application for visualizing economic data, including candlestick charts, order book summaries, and supply & demand analysis.

## Features

- **Market View:**
  - Candlestick chart for market data (using Lightweight Charts)
  - Theme switching (Classic/Modern)
  - CSV upload and default data loading

- **Book Viewer:**
  - Order book summary with bids/asks bar
  - Interactive tables for bids and asks
  - CSV upload and default data loading

- **Supply & Demand Analysis:**
  - **Now uses Chart.js for true XY plotting**
  - Plots demand and supply curves with:
    - **X-axis:** Price (R$)
    - **Y-axis:** Quantity (tons)
  - Interactive chart with tooltips
  - Equilibrium point is marked and displayed
  - CSV upload and default data loading

## Technology

- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) (for candlestick chart)
- [Chart.js](https://www.chartjs.org/) (for supply & demand XY chart)
- TypeScript, HTML, CSS

## CSV Format

### Market Data (Candlestick)
```
Date,Opening,Closing,Variation,Minimum,Maximum
01/01/2023,100,105,5,98,110
...
```

### Order Book
```
order,type,quantity,price
1,Buy,10,100
...
```

### Supply & Demand
```
Price (R$),Quantity Demanded (tons),Quantity Supplied (tons)
1,90,20
2,80,30
...
```

## Usage

1. Clone the repo and install dependencies (if any build step is needed).
2. Open `index.html` in your browser (or run a local server).
3. Use the tabs to switch between Market View, Book Viewer, and Supply & Demand.
4. Upload your CSV files or use the default data buttons.

## Chart.js Integration

- The Supply & Demand tab uses Chart.js for a true XY line chart.
- Price is on the X-axis, Quantity is on the Y-axis.
- Demand and supply curves are shown as lines, and the equilibrium point is marked.
- The chart is interactive and responsive.

## License

Apache 2.0

## Live Demo

[Try the Economy Chart Tool](https://your-demo-link-here)

## Technical Details

- Built with TypeScript
- Uses Lightweight Charts library (v3.8.0) for candlestick visualization
- Responsive design with modern CSS
- Modular code structure
- Type-safe implementation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Lightweight Charts](https://github.com/tradingview/lightweight-charts) for the charting library
- All contributors who have helped improve this tool