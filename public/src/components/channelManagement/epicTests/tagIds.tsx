export interface tagIdData {
  tagid: string;
  firstword: string;
}

const callCAPI = (): Promise<string> => {

  const tempResults = JSON.stringify([
    'environment/wildlife',
    'football/Liverpool',
    'environment/bees',
    'business/world',
    'environment/cabbages',
    'business/bank',
    'environment/trees',
    'environment/plastic',
    'business/shops',
    'environment/clouds',
    'environment/climatechange',
    'environment/walking',
    'football/corruption',
    'business/Manchester',
    'business/economics',
    'business/BankOfEngland',
    'business/shopping',
  ]);

  return new Promise((resolve, reject) => {

    // if (Math.random() < 0.5) {
      resolve(tempResults);
    // }
    // else reject({message: 'Pretend networking error'});
  })
};

export const getTagIdOptions = (): Promise<tagIdData[] | []> => {

  return new Promise((resolve) => {

    callCAPI()
    .then(results => {

      const res: string[] = JSON.parse(results);

      res.sort((a:string, b:string) => (a.toUpperCase() > b.toUpperCase()) ? 1 : -1);

      const options = res.map(tagid => {

        let [firstword] = tagid.split('/');

        return {
          tagid,
          firstword: firstword.toUpperCase(),
        };
      });
      resolve(options);
    })
    .catch(error => {
      console.log(error.message);
      resolve([]);
    })
  });
}
