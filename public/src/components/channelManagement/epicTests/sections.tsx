const callCAPI = (): Promise<string> => {

  const tempResults = JSON.stringify([
    'politics',
    'sport',
    'culture',
    'cooking',
    'technology',
  ]);

  return new Promise((resolve, reject) => {

    // Temporary
    // if (Math.random() < 0.5) {

      resolve(tempResults);
    // }
    // else reject({message: 'Pretend networking error'});
  })
};

export const getSectionOptions = (): Promise<string[] | []> => {

  return new Promise((resolve) => {

    callCAPI()
    .then((res) => resolve(JSON.parse(res)))
    .catch(error => {
      console.log(error.message);
      resolve([]);
    })
  });
};
