import React from "react";
import { fetchJson, saveJson } from "../utils/requests";

interface VersionedData<T> {
  value: T,
  version: string,
}

export type VersionedDataState<T> = VersionedData<T> | 'Pending' | 'Failed';

// type InnerComponent<T> = {
//   fetch: () => void,
//   save: (updated: T) => void
// }
//
// interface Props<T> {
//   // componentBuilder: (t: T) => any
//   // component: React.ComponentType<InnerComponent<T>>
// }
//
// export class Editor<T> extends React.Component<Props<T>, MaybeVersionedData<T>> {
//   state: MaybeVersionedData<T>;
//   path: string;
//
//   protected constructor(props: Props<T>, path: string) {
//     super(props);
//
//     this.state = 'Pending';
//     this.path = path;
//   }
//
//   componentWillMount(): void {
//     this.fetch();
//   }
//
//   fetch(): void {
//     // We trust the server to validate the data
//     fetchJson(this.path).then((serverData: VersionedData<T>) => {
//       this.setState(serverData);
//     });
//   }
//
//   save(): void {
//     saveJson(`${this.path}/update`, this.state)
//       .then(resp => {
//         if (!resp.ok) {
//           resp.text().then(msg => alert(msg));
//         }
//         this.fetch();
//       })
//       .catch((resp) => {
//         alert('Error while saving');
//         this.fetch();
//       });
//   }
//
//   render() {
//     if (this.state === 'Pending') {
//       return <div>Loading...</div>;
//     } else {
//       // return this.props.componentBuilder(this.state.value);
//     }
//   }
// }
