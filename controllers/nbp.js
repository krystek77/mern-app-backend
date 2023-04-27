export const getEuroExchangeRate = async (req, res) => {
  // const URL = 'http://api.nbp.pl/api/exchangerates/rates/c/eur/today/';

  const today = new Date();
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));
  var mm = ('0' + (yesterday.getMonth() + 1)).slice(-2);
  var dd = ('0' + yesterday.getDate()).slice(-2);
  var yy = yesterday.getFullYear();
  const day = `${yy}-${mm}-${dd}`;

  const URL_DAY_BEFORE = `http://api.nbp.pl/api/exchangerates/rates/c/eur/${day}/?format=json`;

  const defaultDataCurrency = {
    table: 'C',
    currency: 'euro',
    code: 'EUR',
    rates: [
      {
        no: '046/C/NBP/2023',
        effectiveDate: new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toLocaleDateString('pl-PL'),
        bid: 1,
        ask: 1,
      },
    ],
  };

  try {
    const response = await fetch(URL_DAY_BEFORE, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 404 || response.statusText === 'Not Found') {
      return res.status(404).json(defaultDataCurrency);
    }
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
