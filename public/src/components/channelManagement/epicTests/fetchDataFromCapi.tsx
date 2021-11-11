import { useState } from 'react';

interface TagIdData {
  id: string;
  display: string;
  section: string;
}

interface SectionData {
  id: string;
  display: string;
}

interface RawTagIdData {
  id?: string;
  type?: string;
  sectionId?: string;
  sectionName?: string;
  webTitle?: string;
  webUrl?: string;
  apiUrl?: string;
  description?: string;
  internalName?: string;
};

interface RawSectionsEditionData {
  id?: string;
  webTitle: string;
  webUrl?: string;
  apiUrl?: string;
  code?: string;
};

interface RawSectionData {
  id?: string;
  webTitle: string;
  webUrl?: string;
  apiUrl?: string;
  code?: string;
  editions?: RawSectionsEditionData[];
}

type SectionDataOrEmpty = SectionData[] | [];
type TagIdDataOrEmpty = TagIdData[] | [];

// Can't use state hook - not in a component
// - This approach doesn't hook into React's state system - probably a bad approach
const tagIdOptions:TagIdData[] = [];
const setTagIdOptions = (vals:any[]):void => {
  tagIdOptions.length = 0;
  tagIdOptions.push(...vals);
};

const sectionOptions:SectionData[] = [];
const setSectionOptions = (vals:any[]):void => {
  sectionOptions.length = 0;
  sectionOptions.push(...vals);
};

let capiFlag = false;
const setCapiFlag = (val:boolean):void => {
  capiFlag = val;
};

const processSectionResults = (data: RawSectionData[] = []): void => {

  const res:SectionData[] = [];

  if (data.length) {

    data.forEach(item => {
      const { id, webTitle } = item;

      if (id && webTitle) {

        const obj:SectionData = {
          id: id, 
          display: webTitle, 
        }
        res.push(obj);
      }
    });

    res.sort((a, b) => {
      if (a.display > b.display) return 1;
      return -1;
    });
  }
  setSectionOptions(res);
};

const processTagIdResults = (data: RawTagIdData[] = []): void => {

  const res:TagIdData[] = [];

  if (data.length) {

    data.forEach(item => {
      const { id, webTitle, sectionName } = item;

      if (id && webTitle && sectionName) {

        const obj:TagIdData = {
          id: id, 
          display: `${webTitle} [${id}]`, 
          section: sectionName.toUpperCase(),
        }
        res.push(obj);
      }
    });

    res.sort((a, b) => {
      if (a.section > b.section) return 1;
      else if (a.section < b.section) return -1;
      else {
        if (a.display > b.display) return 1;
        return -1;
      }
    });
  }
  setTagIdOptions(res);
};

const generateFetchPromise = (url: string, promises: Promise<any>[]): Promise<any> => {
 return new Promise((resolve, reject) => {
   fetch(url)
   .then(res => res.json())
   .then(res => {

     if (res && res.response) {

       const response = res.response;

       if (response.currentPage < response.pages) {
         url = url.replace(`&page=${response.currentPage}`, '');
         url += `&page=${response.currentPage + 1}`;
         promises.push(generateFetchPromise(url, promises));
       }

       if (response.results && response.results.length) {

         tabIdResults.push(...response.results);
       }
     }
     resolve(res);
   })
   .catch(e => reject(e));
 })
};

const tabIdResults: RawTagIdData[] = [];

const callCAPI = (): void => {

  if (!capiFlag) {

    console.log('Starting CAPI fetch');

    setCapiFlag(true);

    const sectionUrl = `${window.location.origin}/capi/sections?page-size=200`;

    fetch(sectionUrl)
    .then(res => res.json())
    .then(packet => {

      const response = packet.response;

      if (response && response.status === 'ok') {

        const data = response.results;

        if (data && data.length) {

          processSectionResults(data);
          return data;
        }
      }
      return false;
    })
    .then(data => {

      const promises: Promise<any>[] = [];

      if (data) {

        const sectionIds: string[] = data.map((d:RawSectionData) => {
         return d.id
        });

        sectionIds.forEach((s) => {

         const typeidUrl = `${window.location.origin}/capi/tags?page-size=1000&section=${s}`;
         promises.push(generateFetchPromise(typeidUrl, promises));
        });
      }
      Promise.allSettled(promises)

      // Delay by a second
      // - trying to capture returns from multi-paged results which take time to settle
      .then(() => {
        setTimeout(() => {
          processTagIdResults(tabIdResults);
          console.log(`CAPI fetch completed - sections: ${sectionOptions.length}; tagIds: ${tagIdOptions.length}`);
        }, 2000);
      })
      .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
  }
  else console.log('CAPI fetch either underway or completed');

};

export {
  SectionDataOrEmpty,
  TagIdDataOrEmpty,
  tagIdOptions,
  sectionOptions,
  callCAPI,
}

