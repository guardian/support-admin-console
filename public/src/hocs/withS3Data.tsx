import React, { useState, useEffect } from 'react';

export interface DataFromServer<T> {
  value: T;
  version: string;
  email: string;
}

export interface InnerProps<T> {
  data: T;
  update: (data: T) => void;
  sendToS3: () => void;
  updateAndSendToS3: (data: T) => void;
  saving: boolean;
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
    const [saving, setIsSaving] = useState<boolean>(false);

    const fetchData = (): Promise<void> =>
      fetchSettings()
        .then(data => {
          setDataFromServer(data);
        })
        .catch(err => alert(err));

    useEffect(() => {
      fetchData();
    }, []);

    const update = (data: T): void => {
      if (!dataFromServer) {
        return;
      }
      setDataFromServer({ ...dataFromServer, value: data });
    };

    const sendToS3 = (): void => {
      if (!dataFromServer) {
        return;
      }
      setIsSaving(true);

      saveSettings(dataFromServer)
        .then(fetchData)
        .then(() => setIsSaving(false));
    };

    const updateAndSendToS3 = (data: T): void => {
      if (!dataFromServer) {
        return;
      }
      setIsSaving(true);

      saveSettings({ ...dataFromServer, value: data })
        .then(fetchData)
        .then(() => setIsSaving(false));
    };

    return dataFromServer ? (
      <Inner
        data={dataFromServer.value}
        update={update}
        sendToS3={sendToS3}
        updateAndSendToS3={updateAndSendToS3}
        saving={saving}
      />
    ) : null; // TODO: add spinner?
  };

  return Wrapped;
}

export default withS3Data;
