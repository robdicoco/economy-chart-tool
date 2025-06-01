# Economy Chart Tool

A modern web application for visualizing financial market data, featuring both candlestick charts and order book visualization. The tool provides an intuitive interface for analyzing market data with real-time updates and interactive features.

## Live Demo

[Try the Economy Chart Tool](https://your-demo-link-here)

## Features

### Market View
- **Interactive Candlestick Chart**
  - Daily candlestick visualization
  - Zoom and pan capabilities
  - Crosshair for precise data reading
  - Customizable time scale
  - Responsive design

- **Data Management**
  - Load default market data
  - Upload custom CSV files
  - Automatic data validation and error handling
  - Support for multiple date formats

- **Theme Options**
  - Classic theme (dark mode)
  - Modern theme (light mode)
  - Consistent styling across all components

### Order Book Viewer
- **Order Book Distribution**
  - Visual representation of bid/ask distribution
  - Interactive bar graph with tooltips
  - Real-time percentage calculations
  - Color-coded indicators (green for bids, red for asks)

- **Order Book Tables**
  - Separate tables for bids and asks
  - Price, quantity, and running total columns
  - Sortable by price
  - Color-coded price indicators
  - Responsive table design

- **Data Management**
  - Load default order book data
  - Upload custom order book CSV files
  - Real-time updates
  - Data validation and error handling

## CSV Format Requirements

### Market Data CSV
Required columns:
- Date (supports formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, YYYY/MM/DD)
- Opening
- Closing
- Variation
- Minimum
- Maximum

Example:
```csv
Date,Opening,Closing,Variation,Minimum,Maximum
2024-01-01,100.50,101.20,0.70,100.00,101.50
```

### Order Book CSV
Required columns:
- Order (order number)
- Type (Buy/Sell)
- Quantity
- Price

Example:
```csv
Order,Type,Quantity,Price
1,Buy,100,50.25
2,Sell,50,50.30
```

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/economy-chart-tool.git
cd economy-chart-tool
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

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

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lightweight Charts](https://github.com/tradingview/lightweight-charts) for the charting library
- All contributors who have helped improve this tool