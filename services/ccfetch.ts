const aboutcontroller = new AbortController();

const lsFetch = async (url: string, method?: string, data?: any) => {
  console.log('entered');
  let options;
  const args = {
    method: method || 'POST',
    body: JSON.stringify(data),
  };
  if (method) {
    options = { ...args };
  }
  console.log(options, args);
  const response = await fetch(`${process.env.PAYSTACK_BASE_URL}${url}`, {
    // signal: aboutcontroller.signal,
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_PRIVATE}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('data', response);
    })
    .catch((res) => {
      console.log('error', res);
    });
  console.log(response);

  return response;
};

export default lsFetch;
