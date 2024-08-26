const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const itemDetailMiddleware = require('./itemDetailMiddleware');

const mock = new MockAdapter(axios);

describe('itemDetailMiddleware', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        mock.reset();
    });

    it('should return item details when valid ID is provided', async () => {
        const id = 'MLA123456';
        req.params.id = id;

        const itemResponse = {
            id,
            title: 'Sample Item',
            currency_id: 'USD',
            price: 100.99,
            pictures: [{ url: 'https://example.com/picture.jpg' }],
            condition: 'new',
            shipping: { free_shipping: true },
            sold_quantity: 10
        };

        const descriptionResponse = {
            plain_text: 'This is a sample description.'
        };

        mock.onGet(`https://api.mercadolibre.com/items/${id}`).reply(200, itemResponse);
        mock.onGet(`https://api.mercadolibre.com/items/${id}/description`).reply(200, descriptionResponse);

        await itemDetailMiddleware(req, res);

        expect(res.json).toHaveBeenCalledWith({
            author: { name: "Camila", lastname: "Zuniga" },
            item: {
                id: itemResponse.id,
                title: itemResponse.title,
                price: {
                    currency: itemResponse.currency_id,
                    amount: 100,
                    decimals: 99
                },
                picture: itemResponse.pictures[0].url,
                condition: 'Nuevo',
                free_shipping: itemResponse.shipping.free_shipping,
                sold_quantity: itemResponse.sold_quantity,
                description: descriptionResponse.plain_text
            }
        });
    });

    it('should return 400 when ID is not provided', async () => {
        await itemDetailMiddleware(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'El parámetro "id" es requerido' });
    });

    it('should return 500 when there is an error fetching data', async () => {
        const id = 'MLA123456';
        req.params.id = id;

        mock.onGet(`https://api.mercadolibre.com/items/${id}`).reply(500);

        await itemDetailMiddleware(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al consultar la API de Mercado Libre' });
    });
});
