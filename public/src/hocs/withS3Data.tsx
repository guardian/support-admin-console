import React, { useState, useEffect } from 'react';

export interface DataFromServer<T> {
  value: T;
  version: string;
  email: string;
}

export interface InnerProps<T> {
  data: T;
  setData: (data: T) => void;
  saveData: () => void;
}

type FetchSettings<T> = () => Promise<DataFromServer<T>>;
type SaveSettings<T> = (data: DataFromServer<T>) => Promise<Response>;

function withS3Data<T>(
  Inner: React.FC<InnerProps<T>>,
  fetchSettings: FetchSettings<T>,
  saveSettings: SaveSettings<T>,
): React.FC {
  const Wrapped: React.FC = () => {
    const [dataFromServer, setDataFromServer] = useState<DataFromServer<T> | null>(null);

    const fetchData = (): void => {
      fetchSettings()
        .then(data => setDataFromServer(data))
        .catch(err => alert(err));
    };

    useEffect(() => {
      fetchData();
    }, []);

    const setData = (data: T): void => {
      console.log('withS3Data setData', dataFromServer, data);
      if (!dataFromServer) {
        return;
      }
      setDataFromServer({ ...dataFromServer, value: data });
    };

    const saveData = (): void => {
      console.log('withS3Data saveData', dataFromServer);
      if (!dataFromServer) {
        return;
      }

      saveSettings(dataFromServer).then(fetchData);
    };

    return dataFromServer ? (
      <Inner data={dataFromServer.value} setData={setData} saveData={saveData} />
    ) : null; // TODO: add spinner?
  };

  return Wrapped;
}

export default withS3Data;
