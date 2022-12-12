import { TickerSettings } from '../helpers/shared';
import { useEffect, useState } from 'react';

interface TickerData {
  total: number;
  goal: number;
}

interface TickerSettingsWithData extends TickerSettings {
  tickerData: TickerData;
}

const useTickerData = (
  tickerSettings: TickerSettings | undefined,
): TickerSettingsWithData | undefined => {
  const [tickerData, setTickerData] = useState<TickerData | undefined>(undefined);

  useEffect(() => {
    if (tickerSettings) {
      fetch(`https://support.theguardian.com/ticker/${tickerSettings.name}.json`)
        .then(resp => resp.json())
        .then(setTickerData)
        .catch(err => alert(`Error fetching ticker data: ${err}`));
    }
  }, [tickerSettings]);

  if (tickerSettings && tickerData) {
    return {
      ...tickerSettings,
      tickerData,
    };
  } else {
    return undefined;
  }
};

export default useTickerData;
