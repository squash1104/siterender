const pecasApi = {
  getPecas: async () => {
    // Simulate API call
    return [
      { id: 1, name: 'Peça 1', description: 'Descrição da peça 1' },
      { id: 2, name: 'Peça 2', description: 'Descrição da peça 2' },
    ];
  },
  createPeca: async (peca) => {
    // Simulate creating a peca
    console.log('Creating peca:', peca);
    return { id: Date.now(), ...peca };
  },
};

export default pecasApi;