import { TickerSettings } from '../helpers/shared';
import { useEffect, useState } from 'react';

interface TickerData {
  total: number;
  goal: number;
}

export interface TickerSettingsWithData extends TickerSettings {
  tickerData: TickerData;
}

const useTickerData = (
  tickerSettings: TickerSettings | undefined,
): TickerSettingsWithData | undefined => {
  const [tickerData, setTickerData] = useState<TickerData | undefined>(undefined);

  useEffect(() => {
    if (tickerSettings) {
      fetch(`https://contributions.guardianapis.com/ticker/${tickerSettings.name}`)
        .then((resp) => resp.json())
        .then((json) => {
          setTickerData({
            total: parseInt(json.total),
            goal: parseInt(json.goal),
          });
        })
        .catch((err) => alert(`Error fetching ticker data: ${err}`));
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
