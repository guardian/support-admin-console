import React from "react";
import { fetchJson, saveJson } from "../utils/requests";

interface VersionedData<T> {
  value: T,
  version: string,
}

export abstract class Editor<P, T> extends React.Component<P, VersionedData<T> | null> {
  state: VersionedData<T> | null;
  path: string;

  protected constructor(props: P, path: string) {
    super(props);

    this.state = null;
    this.path = path;
  }

  componentWillMount(): void {
    this.fetch();
  }

  fetch(): void {
    // We trust the server to validate the data
    fetchJson(this.path).then((serverData: VersionedData<T>) => {
      this.setState(serverData);
    });
  }

  save(): void {
    saveJson(`${this.path}/update`, this.state)
      .then(resp => {
        if (!resp.ok) {
          resp.text().then(msg => alert(msg));
        }
        this.fetch();
      })
      .catch((resp) => {
        alert('Error while saving');
        this.fetch();
      });
  }
}
