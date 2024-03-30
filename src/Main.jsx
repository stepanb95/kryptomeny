import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import Chart from 'chart.js/auto';

const Main = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCrypto, setFilteredCrypto] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coincap.io/v2/assets?limit=10' 
        );
        setCryptoData(response.data.data); 
        setFilteredCrypto(response.data.data); 
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
    filterCrypto(e.target.value);
  };

  const filterCrypto = (query) => {
    if (!query) {
      setFilteredCrypto(cryptoData);
    } else {
      const filtered = cryptoData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(query.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCrypto(filtered);
    }
  };

  const openModal = (crypto) => {
    setSelectedCrypto(crypto);
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
    createChart(crypto);
  };

  const closeModal = () => {
    setSelectedCrypto(null);
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  const createChart = (crypto) => {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1 Day', '1 Month', '1 Year'],
        datasets: [{
          label: `${crypto.name} Price`,
          data: [crypto.changePercent24Hr, crypto.changePercent30D, crypto.changePercentYr],
          borderColor: 'blue',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  };

  return (
    <div className="crypto-container">
      <h1>Kryptoměny</h1>
      <input
        type="text"
        placeholder="Zadej kryptoměnu"
        value={search}
        onChange={handleChange}
      />
      <table>
        <thead>
          <tr>
            <th>Název</th>
            <th>Zkratka</th>
            <th>Hodnota</th>
            <th>Nejvyšší hodnota</th>
            <th>Průměrná hodnota za 24 hodin</th>
            <th>Graf</th>
          </tr>
        </thead>
        <tbody>
          {filteredCrypto.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${parseFloat(crypto.priceUsd).toFixed(1)}</td> 
              <td>${parseFloat(crypto.marketCapUsd).toFixed(1)}</td> 
              <td>${parseFloat(crypto.volumeUsd24Hr).toFixed(1)}</td> 
              <td>
                <button onClick={() => openModal(crypto)}>Graf</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedCrypto && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <canvas id="myChart"></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
