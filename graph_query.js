const graphqlQuery = {
  query: `
    {
      domains(first: 5) {
        id
        name
        labelName
        labelhash
      }
      transfers(first: 5) {
        id
        domain {
          id
        }
        blockNumber
        transactionID
      }
    }
  `
};

module.exports = graphqlQuery;
