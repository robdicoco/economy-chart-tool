# Economy Chart Tool

A modern web application for visualizing financial data using candlestick charts. Built with TypeScript and the Lightweight Charts library.

## Features

- **Interactive Candlestick Charts**
  - Daily candlestick visualization
  - Zoom and pan capabilities
  - Responsive design
  - Customizable themes

- **Data Management**
  - Load default CSV data
  - Upload custom CSV files
  - Automatic data validation and parsing
  - Support for multiple date formats

- **User Interface**
  - Clean, modern design
  - Dark and light themes
  - Loading indicators
  - Error handling and user feedback

## CSV Format Requirements

The application expects CSV files with the following format:
```csv
Date,Opening,Closing,Variation,Minimum,Maximum
```

Example:
```csv
28/05/2025,138.136,138.888,-0,47,138.580,139.547
```

### Supported Date Formats
- DD/MM/YYYY
- DD-MM-YYYY
- YYYY-MM-DD
- YYYY/MM/DD

### Data Validation
- Validates date formats
- Ensures numeric values are valid
- Checks price ranges (minimum ≤ maximum)
- Verifies opening/closing prices are within range

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
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

## Usage

1. **Loading Data**
   - The application automatically loads default data on startup
   - Use the "Load CSV File" button to upload custom data
   - Supported file format: CSV

2. **Chart Interaction**
   - **Zoom**: Use mouse wheel or pinch gesture
   - **Pan**: Click and drag
   - **Reset View**: Double-click
   - **Theme Switch**: Use the theme selector dropdown

3. **Theme Options**
   - **Classic**: Dark blue background with white/black candlesticks
   - **Modern**: White background with green/red candlesticks

## Technical Details

### Built With
- TypeScript
- Lightweight Charts (v3.8.0)
- Modern CSS
- HTML5

### Project Structure
```
economy-chart-tool/
├── public/
│   └── favicon.svg
├── src/
│   └── main.ts
├── dist/
│   └── main.js
├── data/
│   └── default.csv
├── index.html
├── style.css
└── README.md
```

### Key Features
- Type-safe development with TypeScript
- Responsive and mobile-friendly design
- Efficient data parsing and validation
- Smooth animations and transitions
- Error handling and user feedback
- Custom SVG favicon

## Browser Support

The application works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- SVG
- File API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Lightweight Charts](https://github.com/tradingview/lightweight-charts) for the charting library
- TradingView for inspiration in chart design