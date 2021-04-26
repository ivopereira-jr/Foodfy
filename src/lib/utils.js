module.exports = {
  date: function (timestamp) {
    const date = new Date(timestamp)

    //ano
    const year = date.getUTCFullYear()

    //mes 
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)

    //dia
    const day = `0${date.getUTCDate()}`.slice(-2)
    //o utc serve para pegar uma data universal sEM ele e pegada uma data local ou seja d onde vc esta e isso pode gerar alguns bugs

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      format: `${day}/${month}/${year}`
    }

  },
  getParams(query, limit) {
    let { search, page } = query;

    page = page || 1;
    let offset = limit * (page - 1);

    const params = {
      search,
      limit,
      offset,
      page
    };

    return params;
  },

}