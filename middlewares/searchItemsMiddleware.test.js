const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const searchItemsMiddleware = require('./searchItemsMiddleware');

const mock = new MockAdapter(axios);

describe('searchItemsMiddleware', () => {
    let req, res;

    beforeEach(() => {
        req = { query: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        mock.reset();
    });

    it('should return search results when a valid query is provided', async () => {
        const query = 'laptop';
        req.query.q = query;

        const apiResponse = {
            available_filters: [{ id: 'category', values: [{ name: 'Electronics' }] }],
            results: [
                {
                    id: 'MLA1234',
                    title: 'Laptop XYZ',
                    currency_id: 'USD',
                    price: 999.99,
                    thumbnail: 'https://example.com/laptop.jpg',
                    condition: 'new',
                    shipping: { free_shipping: true }
                }
            ]
        };

        mock.onGet(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`).reply(200, apiResponse);

        await searchItemsMiddleware(req, res);

        expect(res.json).toHaveBeenCalledWith({
            author: { name: "Camila", lastname: "Zuniga" },
            category: ['Electronics'],
            items: [
                {
                    id: 'MLA1234',
                    title: 'Laptop XYZ',
                    price: {
                        currency: 'USD',
                        amount: 999,
                        decimals: 99
                    },
                    picture: 'https://example.com/laptop.jpg',
                    condition: 'new',
                    free_shipping: true
                }
            ]
        });
    });

    it('should return 400 when query parameter is missing', async () => {
        await searchItemsMiddleware(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'El parámetro "q" es requerido' });
    });

    it('should return 500 when there is an error fetching data', async () => {
        const query = 'laptop';
        req.query.q = query;

        mock.onGet(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`).reply(500);

        await searchItemsMiddleware(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al consultar la API de Mercado Libre' });
    });
});
