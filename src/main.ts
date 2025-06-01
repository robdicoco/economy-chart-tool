// Interfaces and type definitions
interface CandlestickData {
    Date: Date;
    Opening: number;
    Closing: number;
    Variation: number;
    Minimum: number;
    Maximum: number;
}

interface LightweightChartItem {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface OrderBookEntry {
    order: number;
    type: 'Buy' | 'Sell';
    quantity: number;
    price: number;
}

interface ProcessedOrderBook {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    totalBids: number;
    totalAsks: number;
}

// Theme definitions
const themes = {
    classic: {
        chart: {
            layout: {
                background: { type: 'solid', color: '#191970' }, // Dark Blue
                textColor: 'rgba(220, 220, 220, 0.9)',
            },
            grid: {
                vertLines: { color: 'rgba(200, 200, 200, 0.3)' },
                horzLines: { color: 'rgba(200, 200, 200, 0.3)' },
            },
        },
        series: {
            upColor: '#FFFFFF', // Inner white for positive
            borderUpColor: '#000000', // Contour black for positive
            wickUpColor: '#000000',
            downColor: '#000000', // Inner black for negative
            borderDownColor: '#FFFFFF', // Contour white for negative
            wickDownColor: '#FFFFFF',
        },
    },
    modern: {
        chart: {
            layout: {
                background: { type: 'solid', color: '#FFFFFF' }, // White
                textColor: 'rgba(33, 56, 77, 1)',
            },
            grid: {
                vertLines: { color: 'rgba(230, 230, 230, 1)' },
                horzLines: { color: 'rgba(230, 230, 230, 1)' },
            },
        },
        series: {
            upColor: '#26A69A', // Inner green for positive (TradingView green)
            borderUpColor: '#FFFFFF', // Contour white for positive
            wickUpColor: '#26A69A',
            downColor: '#EF5350', // Inner red for negative (TradingView red)
            borderDownColor: '#FFFFFF', // Contour white for negative
            wickDownColor: '#EF5350',
        },
    },
};

// Application state
let chart: any = null;
let candlestickSeries: any = null;

// Helper functions
function parseDate(dateStr: string): Date | null {
    // Remove any extra whitespace
    dateStr = dateStr.trim();
    
    // Try different date formats
    const formats = [
        // DD/MM/YYYY
        /^(\d{2})\/(\d{2})\/(\d{4})$/,
        // DD-MM-YYYY
        /^(\d{2})-(\d{2})-(\d{4})$/,
        // YYYY-MM-DD
        /^(\d{4})-(\d{2})-(\d{2})$/,
        // YYYY/MM/DD
        /^(\d{4})\/(\d{2})\/(\d{2})$/
    ];

    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            if (format === formats[0] || format === formats[1]) {
                // DD/MM/YYYY or DD-MM-YYYY
                const [_, day, month, year] = match;
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(date.getTime())) return date;
            } else {
                // YYYY-MM-DD or YYYY/MM/DD
                const [_, year, month, day] = match;
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(date.getTime())) return date;
            }
        }
    }

    // If none of the formats match, try the default Date constructor as fallback
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date : null;
}

function parseCSV(csvText: string): CandlestickData[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        alert("CSV must have a header and at least one data row.");
        return [];
    }

    const header = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = ["Date", "Opening", "Closing", "Variation", "Minimum", "Maximum"];
    
    // Basic header validation
    if (JSON.stringify(header) !== JSON.stringify(expectedHeaders)) {
        alert(`CSV header mismatch. Expected: ${expectedHeaders.join(',')}\nGot: ${header.join(',')}`);
        return [];
    }

    const data: CandlestickData[] = [];
    const invalidRows: number[] = [];

    console.log('Starting to parse CSV data...');
    console.log('Total lines:', lines.length);

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        // First split by comma, but handle the variation column specially
        const parts = line.split(',');
        if (parts.length < 6) {
            console.warn(`Invalid number of columns in row ${i + 1}:`, parts);
            invalidRows.push(i + 1);
            continue;
        }

        try {
            // Handle the first 3 columns normally
            const dateStr = parts[0].trim();
            const opening = parseFloat(parts[1].trim().replace(',', '.'));
            const closing = parseFloat(parts[2].trim().replace(',', '.'));

            // Handle variation column which may contain a comma
            let variationStr = parts[3].trim();
            let minIndex = 4;
            // If variation contains a comma, combine with next part
            if (parts.length > 6 && parts[4].trim().match(/^\d+$/)) {
                variationStr += ',' + parts[4].trim();
                minIndex = 5;
            }
            const variation = parseFloat(variationStr.replace(',', '.'));

            // Get minimum and maximum values
            const minimum = parseFloat(parts[minIndex].trim().replace(',', '.'));
            const maximum = parseFloat(parts[minIndex + 1].trim().replace(',', '.'));

            const dateObj = parseDate(dateStr);
            if (!dateObj) {
                console.warn(`Invalid date format in row ${i + 1}: ${dateStr}`);
                invalidRows.push(i + 1);
                continue;
            }

            // Validate numeric values
            if (isNaN(opening) || isNaN(closing) || isNaN(variation) || isNaN(minimum) || isNaN(maximum)) {
                console.warn(`Invalid numeric values in row ${i + 1}:`, { dateStr, opening, closing, variation, minimum, maximum });
                invalidRows.push(i + 1);
                continue;
            }

            // Validate that minimum and maximum make sense
            if (minimum > maximum) {
                console.warn(`Invalid price range in row ${i + 1}: minimum (${minimum}) > maximum (${maximum})`);
                invalidRows.push(i + 1);
                continue;
            }

            // Validate that opening and closing are within the range
            if (opening < minimum || opening > maximum || closing < minimum || closing > maximum) {
                console.warn(`Price out of range in row ${i + 1}:`, { opening, closing, minimum, maximum });
                invalidRows.push(i + 1);
                continue;
            }

            data.push({
                Date: dateObj,
                Opening: opening,
                Closing: closing,
                Variation: variation,
                Minimum: minimum,
                Maximum: maximum,
            });

            // Log the first few rows for debugging
            if (i < 5) {
                console.log('Parsed row:', {
                    date: dateObj.toLocaleDateString(),
                    opening,
                    closing,
                    variation,
                    minimum,
                    maximum
                });
            }

        } catch (error) {
            console.error(`Error parsing row ${i + 1}:`, line, error);
            invalidRows.push(i + 1);
        }
    }

    // Report any invalid rows
    if (invalidRows.length > 0) {
        const message = `Warning: ${invalidRows.length} row(s) had invalid data and were skipped (rows: ${invalidRows.join(', ')}).`;
        console.warn(message);
        if (invalidRows.length < 10) { // Only show alert if there are few invalid rows
            alert(message);
        }
    }

    console.log('Successfully parsed data points:', data.length);
    if (data.length > 0) {
        console.log('Date range:', data[0].Date.toLocaleDateString(), 'to', data[data.length - 1].Date.toLocaleDateString());
        console.log('Sample data point:', data[0]);
    }

    return data;
}

function formatDataForChart(data: CandlestickData[]): LightweightChartItem[] {
    const chartData = data
        .map(item => ({
            // Convert Date to Unix timestamp (seconds)
            time: Math.floor(item.Date.getTime() / 1000),
            open: item.Opening,
            high: item.Maximum,
            low: item.Minimum,
            close: item.Closing,
        }))
        .sort((a, b) => a.time - b.time); // Sort by timestamp

    console.log('Formatted chart data points:', chartData.length);
    if (chartData.length > 0) {
        console.log('Time range:', new Date(chartData[0].time * 1000).toLocaleDateString(), 
                   'to', new Date(chartData[chartData.length - 1].time * 1000).toLocaleDateString());
    }

    return chartData;
}

function applyTheme(themeName: 'classic' | 'modern') {
    if (!chart || !candlestickSeries) return;
    const theme = themes[themeName];
    chart.applyOptions(theme.chart);
    candlestickSeries.applyOptions(theme.series);
}

// Define interfaces for all element types
interface ChartElements {
    // Chart elements
    chartContainer: HTMLElement | null;
    loader: HTMLElement | null;
    themeSelect: HTMLSelectElement | null;
    loadDefaultBtn: HTMLElement | null;
    csvFileInput: HTMLInputElement | null;
    
    // Order book elements
    loadDefaultBookBtn: HTMLElement | null;
    bookCsvFileInput: HTMLInputElement | null;
    bookLoader: HTMLElement | null;
    totalBids: HTMLElement | null;
    totalAsks: HTMLElement | null;
    bidsFill: HTMLElement | null;
    asksFill: HTMLElement | null;
}

// Update function signatures
function displayChart(data: CandlestickData[], elements: ChartElements) {
    if (!elements.chartContainer) return;
  
    // Check if LightweightCharts is available
    if (typeof LightweightCharts === 'undefined') {
        console.error('LightweightCharts library not loaded');
        elements.chartContainer.innerHTML = 'Error: Chart library not loaded. Please refresh the page.';
        return;
    }
  
    console.log('LightweightCharts version:', LightweightCharts.version);
    console.log('LightweightCharts API:', Object.keys(LightweightCharts));
  
    const chartData = formatDataForChart(data);
    if (chartData.length === 0) {
        elements.chartContainer.innerHTML = 'No valid data to display.';
        if (chart) {
            chart.remove();
            chart = null;
        }
        return;
    }
  
    try {
        if (!chart) {
            // Create chart with explicit options
            const chartOptions = {
                layout: {
                    ...themes.classic.chart.layout,
                    background: { type: 'solid', color: themes.classic.chart.layout.background.color },
                },
                grid: themes.classic.chart.grid,
                width: elements.chartContainer.clientWidth,
                height: elements.chartContainer.clientHeight,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    rightOffset: 12,
                    leftOffset: 12,
                    barSpacing: 6,
                    minBarSpacing: 2,
                    fixLeftEdge: false,
                    lockVisibleTimeRangeOnResize: false,
                    rightBarStaysOnScroll: true,
                    borderVisible: true,
                    visible: true,
                    timeUnit: 'day',
                    tickMarkType: 1,
                    allowBoldLabels: true,
                    allowTickVisibleOverride: true,
                    tickMarkFormatter: (time: number, tickMarkType: number, locale: string) => {
                        const date = new Date(time * 1000);
                        const month = date.toLocaleString(locale, { month: 'short' });
                        const day = date.getDate();
                        return `${month} ${day}`;
                    },
                },
                rightPriceScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.1,
                    },
                    borderVisible: true,
                    autoScale: true,
                    mode: LightweightCharts.PriceScaleMode.Normal,
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                    vertLine: {
                        width: 1,
                        color: 'rgba(224, 227, 235, 0.4)',
                        style: 0,
                        visible: true,
                        labelVisible: true,
                    },
                    horzLine: {
                        width: 1,
                        color: 'rgba(224, 227, 235, 0.4)',
                        style: 0,
                        visible: true,
                        labelVisible: true,
                    },
                },
            };
            
            console.log('Creating chart with options:', chartOptions);
            chart = LightweightCharts.createChart(elements.chartContainer, chartOptions);
            
            // Create series with explicit options
            const seriesOptions = {
                ...themes.classic.series,
                priceFormat: {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01,
                },
                borderVisible: true,
                wickVisible: true,
                borderColor: themes.classic.series.borderUpColor,
                wickColor: themes.classic.series.wickUpColor,
                priceLineVisible: true,
                lastValueVisible: true,
                baseLineVisible: false,
            };
            
            console.log('Creating series with options:', seriesOptions);
            candlestickSeries = chart.addCandlestickSeries(seriesOptions);
            
            // Add resize handler
            const resizeObserver = new ResizeObserver(entries => {
                if (entries.length === 0 || entries[0].target !== elements.chartContainer) return;
                const newRect = entries[0].contentRect;
                chart.applyOptions({ 
                    width: newRect.width,
                    height: newRect.height 
                });
            });
            resizeObserver.observe(elements.chartContainer);
        }
        
        console.log('Setting chart data:', chartData);
        candlestickSeries.setData(chartData);
        
        // Set visible range to show all data with better initial spacing
        const timeScale = chart.timeScale();
        
        // Calculate the visible range
        const firstBar = chartData[0];
        const lastBar = chartData[chartData.length - 1];
        const totalDays = (lastBar.time - firstBar.time) / (24 * 60 * 60);
        
        // Calculate appropriate bar spacing based on data density
        const containerWidth = elements.chartContainer.clientWidth;
        const availableWidth = containerWidth - 24; // Account for left/right offsets
        const calculatedBarSpacing = Math.max(2, Math.min(6, availableWidth / totalDays));
        
        // Update chart options with calculated spacing
        chart.applyOptions({
            timeScale: {
                barSpacing: calculatedBarSpacing,
                minBarSpacing: 2,
            }
        });
        
        // Set the visible range with minimal padding
        timeScale.setVisibleRange({
            from: firstBar.time - (12 * 60 * 60), // Half day before first bar
            to: lastBar.time + (12 * 60 * 60),    // Half day after last bar
        });

        // Enable mouse wheel zoom
        chart.applyOptions({
            handleScroll: true,
            handleScale: true,
            mouseWheel: {
                enabled: true,
                zoomSpeed: 0.5,
            },
        });
        
        // Apply theme after data is set
        if (elements.themeSelect) {
            applyTheme(elements.themeSelect.value as 'classic' | 'modern');
        }
    } catch (error) {
        console.error('Error creating or updating chart:', error);
        console.error('Chart object:', chart);
        console.error('Series object:', candlestickSeries);
        elements.chartContainer.innerHTML = `Error creating chart: ${error instanceof Error ? error.message : String(error)}`;
        if (chart) {
            chart.remove();
            chart = null;
            candlestickSeries = null;
        }
    }
}

function showLoader(elements: { loader: HTMLElement | null }) {
    if (elements.loader) {
        elements.loader.classList.remove('hidden');
    }
}

function hideLoader(elements: { loader: HTMLElement | null }) {
    if (elements.loader) {
        elements.loader.classList.add('hidden');
    }
}

async function loadDefaultData(elements: ChartElements) {
    try {
        showLoader(elements);
        const response = await fetch('data/default.csv');
        if (!response.ok) {
            throw new Error(`Failed to load default.csv: ${response.statusText}`);
        }
        const csvText = await response.text();
        const data = parseCSV(csvText);
        displayChart(data, elements);
    } catch (error) {
        console.error("Error loading default data:", error);
        if (elements.chartContainer) {
            elements.chartContainer.innerHTML = `Error loading default data: ${error instanceof Error ? error.message : String(error)}`;
        }
        alert(`Error loading default data: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
        hideLoader(elements);
    }
}

function handleFileUpload(event: Event, elements: ChartElements) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        showLoader(elements);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target?.result as string;
                const data = parseCSV(csvText);
                if (data.length > 0) {
                    displayChart(data, elements);
                } else if (chart) {
                    chart.remove();
                    chart = null;
                    candlestickSeries = null;
                    if (elements.chartContainer) {
                        elements.chartContainer.innerHTML = 'Failed to parse CSV or CSV is empty. Please check the format and content.';
                    }
                }
            } catch (error) {
                console.error("Error processing file:", error);
                if (elements.chartContainer) {
                    elements.chartContainer.innerHTML = `Error processing file: ${error instanceof Error ? error.message : String(error)}`;
                }
            } finally {
                hideLoader(elements);
            }
        };
        reader.onerror = () => {
            alert("Error reading file.");
            if (elements.chartContainer) {
                elements.chartContainer.innerHTML = 'Error reading the uploaded file.';
            }
            hideLoader(elements);
        };
        reader.readAsText(file);
    }
}

// Order Book functions
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId!)?.classList.add('active');
        });
    });
}

async function loadDefaultBookData() {
    try {
        const response = await fetch('data/default_bookoffers.csv');
        const csvText = await response.text();
        processOrderBookData(csvText);
    } catch (error) {
        console.error('Error loading default book data:', error);
        alert('Error loading default book data. Please try again.');
    }
}

function processOrderBookData(csvText: string) {
    const bookLoader = document.getElementById('bookLoader');
    bookLoader?.classList.remove('hidden');

    try {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        const orders: OrderBookEntry[] = lines.slice(1).map(line => {
            const [order, type, quantity, price] = line.split(',');
            return {
                order: parseInt(order),
                type: type as 'Buy' | 'Sell',
                quantity: parseInt(quantity),
                price: parseFloat(price.replace('"', '').replace('"', '').replace(',', '.'))
            };
        });

        const processedBook = processOrders(orders);
        displayOrderBook(processedBook);
    } catch (error) {
        console.error('Error processing order book data:', error);
        alert('Error processing order book data. Please check the file format.');
    } finally {
        bookLoader?.classList.add('hidden');
    }
}

function processOrders(orders: OrderBookEntry[]): ProcessedOrderBook {
    const bids = orders.filter(order => order.type === 'Buy')
        .sort((a, b) => b.price - a.price);
    const asks = orders.filter(order => order.type === 'Sell')
        .sort((a, b) => a.price - b.price);

    const totalBids = bids.reduce((sum, order) => sum + order.quantity, 0);
    const totalAsks = asks.reduce((sum, order) => sum + order.quantity, 0);

    return { bids, asks, totalBids, totalAsks };
}

function displayOrderBook(book: ProcessedOrderBook) {
    // Update summary values
    const totalBidsElement = document.getElementById('totalBids');
    const totalAsksElement = document.getElementById('totalAsks');
    const bidsFill = document.querySelector('.bids-fill') as HTMLElement;
    const asksFill = document.querySelector('.asks-fill') as HTMLElement;

    if (totalBidsElement) totalBidsElement.textContent = book.totalBids.toString();
    if (totalAsksElement) totalAsksElement.textContent = book.totalAsks.toString();

    const total = book.totalBids + book.totalAsks;
    const bidsPercentage = (book.totalBids / total) * 100;
    const asksPercentage = (book.totalAsks / total) * 100;

    // Update bar widths and tooltips
    if (bidsFill) {
        bidsFill.style.width = `${bidsPercentage}%`;
        bidsFill.setAttribute('data-tooltip', `Bids: ${bidsPercentage.toFixed(1)}%`);
    }
    if (asksFill) {
        asksFill.style.width = `${asksPercentage}%`;
        asksFill.setAttribute('data-tooltip', `Asks: ${asksPercentage.toFixed(1)}%`);
    }

    // Update tables
    updateOrderTable('bidsTable', book.bids);
    updateOrderTable('asksTable', book.asks);
}

function updateOrderTable(tableId: string, orders: OrderBookEntry[]) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';
    let runningTotal = 0;

    orders.forEach(order => {
        runningTotal += order.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="price">${order.price.toFixed(2)}</td>
            <td>${order.quantity}</td>
            <td>${runningTotal}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Get all required elements
    const elements: ChartElements = {
        // Chart elements
        chartContainer: document.getElementById('chartContainer'),
        loader: document.getElementById('loader'),
        themeSelect: document.getElementById('themeSelect') as HTMLSelectElement,
        loadDefaultBtn: document.getElementById('loadDefaultBtn'),
        csvFileInput: document.getElementById('csvFileInput') as HTMLInputElement,
        
        // Order book elements
        loadDefaultBookBtn: document.getElementById('loadDefaultBookBtn'),
        bookCsvFileInput: document.getElementById('bookCsvFileInput') as HTMLInputElement,
        bookLoader: document.getElementById('bookLoader'),
        totalBids: document.getElementById('totalBids'),
        totalAsks: document.getElementById('totalAsks'),
        bidsFill: document.querySelector('.bids-fill') as HTMLElement,
        asksFill: document.querySelector('.asks-fill') as HTMLElement
    };

    // Initialize tabs
    initializeTabs();

    // Chart event listeners
    if (elements.loadDefaultBtn) {
        elements.loadDefaultBtn.addEventListener('click', () => loadDefaultData(elements));
    }

    if (elements.csvFileInput) {
        elements.csvFileInput.addEventListener('change', (event: Event) => handleFileUpload(event, elements));
    }

    if (elements.themeSelect) {
        elements.themeSelect.addEventListener('change', () => {
            if (elements.themeSelect) {
                applyTheme(elements.themeSelect.value as 'classic' | 'modern');
            }
        });
    }

    // Order book event listeners
    if (elements.loadDefaultBookBtn) {
        elements.loadDefaultBookBtn.addEventListener('click', loadDefaultBookData);
    }

    if (elements.bookCsvFileInput) {
        elements.bookCsvFileInput.addEventListener('change', (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const csvText = e.target?.result as string;
                    processOrderBookData(csvText);
                };
                reader.readAsText(file);
            }
        });
    }

    // Load initial data
    if (elements.chartContainer) {
        loadDefaultData(elements);
    }
    loadDefaultBookData();
});