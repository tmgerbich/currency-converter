import React, { useState, useEffect } from 'react';
import './App.css';

function CurrencyConverter() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('AUD');
  const [targetCurrency, setTargetCurrency] = useState('AUD');
  const [amount, changeAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [ratesFetched, setRatesFetched] = useState(false);
  const [historicalRate, setHistoricalRate] = useState(null);
  const [historicalDate, setHistoricalDate] = useState('2021-01-01');
  const [favoritePairs, setFavoritePairs] = useState([]);

  useEffect(() => {
    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_zb4xEG2qJaHi7ZKRBzPzspvbBTjGjUBCoTRD24gj&base_currency=${baseCurrency}`)
      .then(response => response.json())
      .then(data => {
        setRates(data.data);
        setRatesFetched(!ratesFetched);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, [baseCurrency]);

  useEffect(() => {
    if (amount && baseCurrency && targetCurrency && rates[targetCurrency]) {
      const rate = rates[targetCurrency];
      setConvertedAmount(amount * rate);
    }
  }, [amount, baseCurrency, targetCurrency, rates, ratesFetched]);

  const handleBaseCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  const handleTargetCurrencyChange = (e) => {
    setTargetCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    changeAmount(e.target.value);
  };

  const fetchHistoricalRate = () => {
    fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_zb4xEG2qJaHi7ZKRBzPzspvbBTjGjUBCoTRD24gj&base_currency=${baseCurrency}&date=${historicalDate}`)
      .then(response => response.json())
      .then(data => {
        const rate = data.data[historicalDate][targetCurrency];
        setHistoricalRate(`Historical exchange rate on ${historicalDate}: 1 ${baseCurrency} = ${rate.toFixed(2)} ${targetCurrency}`);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const handleDateChange = (e) => {
    setHistoricalDate(e.target.value);
  };

  const fetchFavoritePairs = () => {
    fetch('/api/favoritePairs')
      .then(response => response.json())
      .then(data => {
        setFavoritePairs(data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const saveFavoritePair = () => {
    fetch('/api/favoritePairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseCurrency, targetCurrency })
    })
      .then(response => response.json())
      .then(data => {
        setFavoritePairs([...favoritePairs, data]);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const handleFavoritePairClick = (base, target) => {
    setBaseCurrency(base);
    setTargetCurrency(target);
  };

  useEffect(() => {
    fetchFavoritePairs();
  }, []);

  return (
    <>
      <h1>Currency Converter</h1>
      <div className="converter">
        <label htmlFor="base-currency">Base Currency:</label>
        <select id="base-currency" onChange={handleBaseCurrencyChange} value={baseCurrency}>
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" value={amount} min="0" onChange={handleAmountChange} />
        <label htmlFor="target-currency">Target Currency:</label>
        <select id="target-currency" onChange={handleTargetCurrencyChange} value={targetCurrency}>
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <p>Converted Amount: <span id="converted-amount">{convertedAmount.toFixed(2)}</span></p>
        <label htmlFor="historical-date">Historical Date:</label>
        <input type="date" id="historical-date" value={historicalDate} onChange={handleDateChange} />
        <button id="historical-rates" onClick={fetchHistoricalRate}>View Historical Rates</button>
        <div id="historical-rates-container">
          {historicalRate && <p>{historicalRate}</p>}
        </div>
        <button id="save-favorite" onClick={saveFavoritePair}>Save Favorite</button>
        <div id="favorite-currency-pairs">
          <h2>Favorite Currency Pairs</h2>
          <ul>
            {favoritePairs.map((pair, index) => (
              <li key={index}>
                <button onClick={() => handleFavoritePairClick(pair.baseCurrency, pair.targetCurrency)}>
                  {pair.baseCurrency}/{pair.targetCurrency}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default CurrencyConverter;
